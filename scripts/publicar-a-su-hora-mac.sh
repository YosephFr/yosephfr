#!/bin/zsh
# Respaldo local del workflow «Publicar a su hora»: el cron de GitHub Actions no dispara en este repo.
# Lo corre launchd (com.yosephfr.publicar) cada hora de 9 a 23 a los :05. Si no hay nada pendiente, el workflow no despliega.
export PATH=/opt/homebrew/bin:/usr/bin:/bin
echo "$(date '+%F %T') lanzo publicar-a-su-hora"
gh workflow run publicar-a-su-hora.yml -R YosephFr/yosephfr --ref main
