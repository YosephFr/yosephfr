#!/usr/bin/env python3
import os,sys,re,tarfile,pathlib,shutil,subprocess,json,time,fcntl,signal
site=sys.argv[1]
if site not in ['indebooks.lat','yosephfr.com']:raise SystemExit('Unknown site')
match=re.fullmatch(r'deploy ([0-9a-f]{40})',os.environ.get('SSH_ORIGINAL_COMMAND',''))
if not match:raise SystemExit('Only deploy <commit> is allowed')
def stop_release(release):
 if release is None:return
 expected=str(pathlib.Path(release).resolve()/'runtime')
 for proc in pathlib.Path('/proc').iterdir():
  if not proc.name.isdigit():continue
  try:
   if os.readlink(str(proc/'cwd'))==expected:
    command=(proc/'cmdline').read_bytes()
    if b'next-server' in command or b'node' in command:os.kill(int(proc.name),signal.SIGTERM)
  except (OSError,PermissionError):pass
revision=match.group(1)
home=pathlib.Path.home();root=home/'domains'/site;state=root/'state';state.mkdir(exist_ok=True);state.chmod(0o700)
lock=(state/'deploy.lock').open('w');fcntl.flock(lock,fcntl.LOCK_EX)
releases=root/'app/releases';releases.mkdir(parents=True,exist_ok=True);candidate=releases/revision
if candidate.exists():raise SystemExit('Release already exists; inspect the previous attempt before retrying')
candidate.mkdir();size=0;count=0
try:
 with tarfile.open(fileobj=sys.stdin.buffer,mode='r|gz') as archive:
  for item in archive:
   parts=pathlib.PurePosixPath(item.name).parts
   if item.isdir():continue
   if not item.isfile() or '..' in parts or item.name.startswith('/') or any(x.startswith('.env') for x in parts):raise RuntimeError('Unsafe archive member')
   size+=item.size;count+=1
   if size>800*1024*1024 or count>50000:raise RuntimeError('Archive exceeds deployment limit')
   target=candidate.joinpath(*parts);target.parent.mkdir(parents=True,exist_ok=True)
   with archive.extractfile(item) as source,target.open('wb') as out:shutil.copyfileobj(source,out)
   target.chmod(0o755 if item.mode & 0o111 else 0o644)
 if (candidate/'REVISION').read_text().strip()!=revision:raise RuntimeError('Commit mismatch')
 if site=='indebooks.lat':
  assert (candidate/'server.cjs').is_file()
  assert (state/'.env').is_file()
  active=root/'app/current'
  restart=state/'restart';restart.mkdir(exist_ok=True)
 else:
  assert (candidate/'public/index.html').is_file()
  active=root/'public_html'
  if active.is_dir() and not active.is_symlink():
   initial=state/'before-autodeploy-public_html'
   if initial.exists():raise RuntimeError('Initial backup already exists')
   shutil.move(str(active),str(initial))
   active.symlink_to(initial)
  acme=state/'well-known';acme.mkdir(exist_ok=True)
  if (candidate/'public/.well-known').exists():shutil.rmtree(str(candidate/'public/.well-known'))
  (candidate/'public/.well-known').symlink_to(acme)
 previous=os.readlink(str(active)) if active.is_symlink() else None
 previous_release=(active.parent/previous).resolve() if previous else None
 configuration=root/'public_html/.htaccess'
 old_configuration=configuration.read_text() if site=='indebooks.lat' else None
 temporary=active.with_name(active.name+'.next')
 if temporary.is_symlink():temporary.unlink()
 temporary.symlink_to(candidate/'public' if site=='yosephfr.com' else candidate);os.replace(str(temporary),str(active))
 if site=='indebooks.lat':
  # LiteSpeed retains a resolved PassengerAppRoot across symlink changes.
  # An explicit release path plus retiring the previous worker forces readback
  # from the new commit; retain the prior configuration for rollback.
  updated=re.sub(r'^PassengerAppRoot .*$', 'PassengerAppRoot '+str(candidate),old_configuration,flags=re.M)
  new_configuration=configuration.with_name('.htaccess.next')
  new_configuration.write_text(updated);os.replace(str(new_configuration),str(configuration))
  (restart/'restart.txt').touch()
  stop_release(previous_release)
 success=False
 for attempt in range(18):
  time.sleep(2)
  route='/api/health' if site=='indebooks.lat' else '/version.json'
  command=['curl','--fail','--silent','--show-error','--max-time','15','--resolve',site+':443:45.152.44.122','-H','Cache-Control: no-cache','https://'+site+route+'?release='+revision]
  result=subprocess.run(command,stdout=subprocess.PIPE,stderr=subprocess.PIPE,universal_newlines=True)
  try:success=result.returncode==0 and json.loads(result.stdout).get('revision')==revision
  except ValueError:success=False
  if success:
   page=subprocess.run(['curl','--fail','--silent','--max-time','20','--resolve',site+':443:45.152.44.122','https://'+site+'/?release='+revision],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
   success=page.returncode==0 and len(page.stdout)>1000
  if success:break
 if not success:
  if previous:
   temporary.symlink_to(previous);os.replace(str(temporary),str(active))
   if site=='indebooks.lat':
    configuration.write_text(old_configuration)
    (restart/'restart.txt').touch()
    stop_release(candidate)
  raise RuntimeError('Health verification failed; previous release restored')
 (state/'last-deploy.json').write_text(json.dumps({'revision':revision,'deployed_at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'files':count,'bytes':size}))
 print('Deployed and verified '+site+' '+revision)
except Exception:
 if not (root/'public_html').is_symlink() or os.path.realpath(str(root/'public_html'))!=str(candidate):
  if not (root/'app/current').is_symlink() or os.path.realpath(str(root/'app/current'))!=str(candidate):shutil.rmtree(str(candidate),ignore_errors=True)
 raise
