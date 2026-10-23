---
title: "Los límites del agente viven en el código"
description: "Por qué los límites de un agente de IA tienen que ejecutarse en código: presupuesto, herramientas, pasos y tiempo. El prompt no es un control."
date: "2026-10-22"
updated: "2026-10-22"
lang: es
tags:
  - agentes
  - guardrails
  - producción
draft: false
faq:
  - q: "¿Por qué un prompt no alcanza para limitar a un agente?"
    a: "Porque el modelo puede ignorarlo, reformularlo o no verlo si el contexto se llena. Un prompt pide una conducta. Un límite en código impide la acción: no llama la herramienta, no sigue al siguiente paso o corta el turno."
  - q: "¿Qué límites conviene poner en el runtime?"
    a: "Los que acotan daño: qué herramientas existen, cuántos pasos puede dar, cuánto tiempo y cuánto gasto admite el turno, y qué forma debe tener la salida. El tono y el orden de las preguntas pueden vivir en el prompt."
  - q: "¿El agente puede saltarse un límite si el cliente insiste?"
    a: "No, si el límite está en el código. La insistencia cambia el texto, no el permiso. Si un caso legítimo choca con el límite, se cambia el código a propósito, no se 'deja pasar esta vez' desde el prompt."
---

Un prompt es una petición. Un límite es una puerta. Durante un tiempo traté de resolver el riesgo de un agente escribiendo mejor la petición: no inventes, no prometas reembolsos, no llames dos veces, pide ayuda si no sabes. El modelo asentía en las pruebas y, con [tráfico real](/blog/operar-14000-conversaciones-de-ia), hacía la otra cosa en el hilo que importaba. No porque fuera malicioso. Porque una petición compite con todo el contexto, con el deseo de ser útil y con un cliente que insiste.

Desde entonces el criterio es simple. Lo que puede causar daño si se ignora vive en código. El prompt se queda con el tono, el orden y la forma de explicar. Esta nota es el detalle de ese criterio, el mismo que uso para que una sola persona pueda operar el volumen sin revisar cada turno. La puerta de al lado, la de las claves y el gasto, está en [rotar claves y alertas](/blog/rotar-claves-api-agentes).

## El prompt pide y el runtime decide

El prompt entra al modelo junto con el historial. El runtime es el programa que decide si hay otra llamada, si esa herramienta existe y si la respuesta puede salir. El modelo propone. El runtime dispone.

Si el límite está solo en el prompt, el modelo es juez y parte. Le pedimos que no use una herramienta y se la mostramos. En las pruebas, con un cliente imaginario, suele obedecer. En producción el cliente insiste, pega un historial o pide la excepción que el prompt desaconseja. El modelo negocia. A veces negocia mal.

El runtime no negocia. Si la herramienta no está en la lista, la llamada no sale. Si no hay un noveno paso, no hay noveno paso. Si el turno se quedó sin tiempo, se corta y se dice eso. El cliente puede insistir. El texto cambia. El permiso no.

## Qué límite corresponde a cada riesgo

No todo riesgo se parece. Separo los límites por el daño que evitan. Actuar de más se limita con la lista de herramientas. No terminar nunca, con pasos y tiempo. Gastar de más, con el presupuesto del turno y la identidad de la clave. Afirmar algo falso, exigiendo que ciertas frases solo salgan si una herramienta las respaldó. Un dato mal formado, con un esquema de salida.

El tono no entra en esa lista. Si suena frío, se corrige en el prompt y en la muestra. Si promete un reembolso, no alcanza con una frase más: esa herramienta no se ofrece, y la promesa no sale sin un resultado que la autorice. Un cambio de tono no debería tocar permisos. Un cambio de permisos no debería esconderse en un párrafo que nadie relee.

## Herramientas

La lista de herramientas es el límite más importante: es el único modo en que el agente toca el mundo. Consultar un estado no es modificarlo. Si las dos están en el mismo turno, al modelo le basta una razón débil para elegir la que escribe.

Por defecto dejo herramientas de lectura y una de handoff. Las de escritura, si existen, exigen condiciones que el código comprueba: identificador válido y un estado que lo permita. El modelo puede pedir la acción. No la autoriza porque la frase sonó segura.

Cada herramienta declara qué datos exige. Si falta uno, el runtime no lo inventa: devuelve un error claro y el agente lo pide o para. Un error opaco empuja a inventar el éxito. También limito las repeticiones. Una segunda llamada igual se responde con el resultado de la primera. El agente puede reformular. No puede martillar el sistema.

## Presupuesto

Cada turno tiene un techo de gasto y de tokens. No es el techo del día, que vive en la identidad y en las alertas. Es el techo de esta conversación, ahora. Un hilo no puede consumir lo de cientos porque el historial entró entero.

El presupuesto se descuenta en el runtime, antes del siguiente paso. Si no alcanza, no hay siguiente paso. El agente recibe "límite de turno" y una salida ya prevista: resumir y, si hace falta, ofrecer el handoff. No le pido que sea consciente del costo. El contador no está en su cabeza.

Eso también frena al cliente que pega un documento enorme o pide analizar todo otra vez. El turno se acaba. El hilo puede seguir después, con contexto recortado. El techo del turno y el de la identidad no se reemplazan: uno evita que un hilo se desborde, el otro que se desborde el día. Ninguno es una línea que diga "sé económico".

## Pasos y tiempo

Un agente con herramientas es un ciclo. Sin máximo, el ciclo es un while. Lo vi cuando una herramienta devolvía un error y el modelo lo leía como "inténtalo de otro modo" para siempre.

El máximo de pasos es bajo. Estos flujos necesitan entender el pedido, llamar una o dos herramientas y responder o salir. Si un caso pide más, casi siempre falta un dato o no debería estar en el agente.

Al lado va el tiempo. Una herramienta lenta no retiene el worker sin límite. El timeout es parte del contrato: el modelo ve un timeout, no un éxito vacío, y la respuesta dice que no se pudo consultar. Pasos y tiempo se reinician por turno. Un proceso largo, si hiciera falta, sería un trabajo en cola, no un chat que no termina.

## Salida

El último límite es la forma de lo que sale. La decisión —resolver, pedir un dato o derivar— viaja en una estructura que el código valida. Si no valida, no se envía. Interpretar a ojo es no haber puesto el esquema.

Confirmar una fecha, un monto o un estado exige la herramienta correspondiente en ese turno. El checker busca la afirmación y el respaldo. Si no está, sale una versión que no afirma. El modelo puede haber escrito algo más lindo. No sale. El checker no cubre todos los matices del idioma. Cubre lo que sale caro cuando es falso. El resto se ve en la muestra y, si se repite, se vuelve otra regla.

## Por qué la gente lo deja en el prompt

Porque es rápido. Se edita una frase, se prueba con dos ejemplos amables y se siente el control. Ese control dura lo que tardan esos ejemplos. También porque el prompt es el sitio que todo el mundo mira, así que las reglas se acumulan ahí, se contradicen, y el modelo elige cuál gana.

Mover un límite al código obliga a nombrarlo: permiso, máximo o esquema. Si no se puede nombrar, era un deseo. Los deseos pueden quedarse en el prompt. Y cuando un límite bloquea un caso legítimo, la salida es cambiar el código con un test, o dejar el caso fuera del agente. Las dos dejan rastro. Editar el prompt de noche no.

## Cómo lo dejo escrito

Un turno de conversación, visto desde el runtime, cabe en una ficha. Los números de abajo son la forma del límite, no una métrica de negocio. Cambian si el flujo cambia. No cambian porque un prompt lo pida.

```text
herramientas:
  consultar_estado: permitir, maximo 2 por turno
  dejar_nota: permitir
  devolver_dinero: no ofrecer
pasos_maximos: 8
tiempo_turno_ms: 12000
presupuesto_turno: acotado
salida:
  decision: resolver | pedir_dato | derivar
  afirmar_estado: solo si consultar_estado respondió en este turno
```

La ficha se prueba con casos. El cliente pide un reembolso y la herramienta no está: el runtime no la llama. La herramienta cuelga: corta el tiempo y no se inventa el estado. El modelo quiere otro paso cuando ya no quedan: no hay otro paso. Esos tests son el límite. La ficha es la documentación.

Cuando aparece un fallo nuevo, pregunto qué puerta faltó. Si faltó, va al código con un test. Si el problema es de tono o de orden, ahí sí toco el prompt. El prompt sigue siendo la diferencia entre un agente claro y uno confuso. No es la diferencia entre uno que puede devolver dinero y uno que no puede. Esa, si quiero dormir, tiene que estar en el programa que ejecuta el turno.
