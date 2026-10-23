---
title: "Operar 14.000 conversaciones de IA al mes"
description: "Cómo mantengo unas 14.000 conversaciones de IA al mes como único equipo técnico: colas, fallos, muestreo de calidad y qué no dejo en manos del agente."
date: "2026-10-20"
updated: "2026-10-22"
lang: es
tags:
  - operaciones
  - agentes
  - producción
draft: false
faq:
  - q: "¿Qué significa operar 14.000 conversaciones al mes siendo una sola persona?"
    a: "Significa que el sistema atiende el volumen y una persona diseña, vigila y corrige el conjunto. No se leen una por una. Se miran colas, fallos, muestras y los casos que el agente no puede cerrar solo."
  - q: "¿Qué conversación no conviene dejar en manos del agente?"
    a: "La que cambia dinero, identidad o una promesa que nadie puede cumplir si el modelo se equivoca. Esas salen de la automatización con un motivo visible y una persona las cierra."
  - q: "¿Cómo se revisa la calidad sin un equipo de analistas?"
    a: "Con una muestra fija cada semana, leída con el mismo criterio, más una revisión de todo lo que falló: herramientas, tiempos de espera y handoffs. La muestra enseña el tono. Los fallos enseñan el sistema."
---

Unas 14.000 conversaciones al mes no se sienten como un número redondo cuando uno es la única persona que las diseña y las opera. Se sienten como una cola que no puede quedarse quieta. Cada conversación es un hilo con estado: qué pidió el cliente, qué herramientas se llamaron, qué se prometió y qué quedó abierto. Si ese estado se pierde, el agente saluda de nuevo, repite una pregunta o confirma algo que ya no es cierto.

Este texto es el mapa para que ese volumen no dependa de heroísmo. No hay un equipo revisando chats. Hay un sistema que aguanta el día y una rutina corta para ver qué se rompió. El complemento está en [los límites que viven en código](/blog/limites-de-agentes-en-codigo) y en [la rotación de claves y las alertas de gasto](/blog/rotar-claves-api-agentes).

## Qué cuenta como conversación

Cuento un hilo, no un mensaje suelto. Un cliente puede escribir cuatro veces en una hora y seguir en la misma conversación si el tema no cambió. También cuento el hilo que empezó en un canal y siguió en otro, siempre que el estado viaje con la persona. Si cada canal abre un expediente nuevo, el volumen se infla y el agente contradice lo que dijo diez minutos antes.

El dato que me importa no es el mensaje más ingenioso. Es si el hilo terminó en un estado honesto: resuelto, derivado o esperando un dato que el cliente todavía no dio. Un hilo "abierto" sin dueño es deuda. A 14.000 al mes, esa deuda se acumula en silencio si nadie la nombra.

## El trabajo real de una sola persona

Ser una sola persona no significa leer el tráfico. Significa decidir qué está automatizado de punta a punta y qué tiene una salida. Mi día no es una bandeja de chats. Es una lista corta: cola atrasada, herramientas que devolvieron error, promesas que el sistema no puede cumplir y una muestra de conversaciones normales.

El agente puede saludar, pedir el dato que falta, consultar un estado y responder con lo que la herramienta devolvió. No puede inventar una excepción ni prometer algo que nadie autorizó. Ese borde lo defino en código antes de pulir el tono. Si llega después, el prompt se llena de advertencias que el modelo lee como sugerencias.

## Cola, estado y reintentos

La cola es el corazón. Cada mensaje entra, se asocia a un hilo y se procesa una vez. El error clásico es procesarlo dos veces porque el proveedor reenvió el webhook o porque el worker murió después de responder y antes de marcar el trabajo como hecho. El cliente ve dos respuestas, o una respuesta y un silencio que después se llena con otra.

Uso tres reglas que no negocio:

- Cada trabajo lleva una clave de idempotencia. Si llega de nuevo, no se vuelve a ejecutar el lado con efectos.
- El estado del hilo se guarda antes de llamar al modelo cuando el paso es irreversible, y después cuando el paso solo lee.
- Un reintento tiene tope y una razón. Un hilo no puede quedarse reintentando toda la noche porque una herramienta estuvo lenta.

El estado mínimo cabe en poco: intención, datos ya confirmados, herramientas usadas y el último error. No guardo el hilo entero en el prompt. Un contexto eterno arrastra una promesa vieja. Lo que el siguiente turno no necesita se queda en el historial. Si la cola crece, miro la causa antes de subir máquinas: más capacidad, sin esa lectura, solo esconde el problema un día.

## Qué automatizo y qué no

Automatizo lo que tiene una respuesta verificable. Consultar un estado, pedir un número de pedido, explicar un horario que está escrito, confirmar que un dato llegó. Si la herramienta devuelve un valor, el agente puede decir ese valor. Si no hay valor, dice que no lo tiene. No rellena.

No automatizo lo que crea una obligación nueva. Un cambio de precio, una excepción a una política, una queja que pide compensación, un caso donde el cliente dice que ya pagó y el sistema no lo ve. Ahí el agente resume, pide el dato que falta si hace falta, y entrega el hilo con contexto. La salida no es un fracaso del modelo. Es el diseño.

Esa salida tiene que ser visible. Un handoff que cae en un buzón que nadie abre es peor que no haber automatizado, porque el cliente cree que alguien lo tomó. Si el mismo tipo de salida se repite, o se vuelve una herramienta, o queda escrito como algo que el agente no intenta. Tampoco dejo que prometa un plazo: si no existe quien va a llamar, esa frase no sale.

## Cómo miro la calidad sin un equipo

No puedo leer 14.000 hilos. Puedo leer una muestra y todos los fallos. La muestra es fija: mismos días, mismo tamaño, mismo criterio. Anoto tres cosas y nada más. ¿El agente entendió el pedido? ¿Dijo algo que la herramienta no respalda? ¿El cliente tuvo que repetirse?

Los fallos los miro completos. Una herramienta que agotó el tiempo, un paso de más, un mensaje duplicado, un handoff sin resumen. Esos no son anécdotas. Son defectos del sistema y se arreglan en código o en la definición de la herramienta. Si el mismo fallo aparece en la muestra y en los logs, ya sé que no es un caso raro.

Un agente rápido que inventa es peor que uno lento que dice "no tengo ese dato". Junto al volumen miro cuántos hilos salieron del flujo automático y por qué. Si esa salida crece, o cambió el tráfico, o el agente está empujando fuera un caso que antes resolvía.

Una vez por semana reescribo una sola cosa: la peor falla de la muestra o el error más repetido. Un cambio chico, y a la semana siguiente miro si esa falla bajó.

## Una semana de operación

El lunes miro la cola y los errores de herramientas. Si algo reintentó hasta el tope, leo esos hilos antes que la muestra. A mitad de semana hago el cambio único, con un caso real al lado. Después leo la muestra con el mismo criterio y anoto qué quedó afuera a propósito: temas que el agente no va a tocar aunque sepa improvisar.

En el [blog](/blog) dejo el patrón cuando ya se puede explicar sin un incidente abierto. El corte del día son tres preguntas: ¿la cola drena?, ¿alguna herramienta falla de más?, ¿hay handoffs sin dueño? Si las tres están tranquilas, no sigo leyendo.

## Fallos que ya vi

El primero es el agente que confirma. El cliente pregunta si puede hacer algo y el modelo dice que sí. La herramienta nunca se consultó. El arreglo no fue un prompt más severo: fue negar la confirmación si no hubo una llamada que la respalde.

El segundo es el hilo zombie. El cliente se fue, el worker reintentó, y a la mañana siguiente el agente contestó en un canal que ya nadie miraba, o peor, contestó dos veces. El tope de reintentos y la idempotencia cerraron eso. También dejé de tratar el silencio del cliente como una orden de insistir.

El tercero es el contexto inflado. Alguien pegó el historial entero "para que no se pierda nada". El modelo se agarró de una promesa de la semana pasada y la repitió. Recortar el contexto con reglas, no con fe, fue el arreglo. Lo viejo queda guardado. No entra al próximo turno si no hace falta.

El cuarto es el handoff mudo: "te paso con alguien" y el resumen llegaba vacío. Ahora no se envía si faltan el pedido, los datos ya dados o el motivo de la salida.

## Qué haría distinto

Empezaría por la cola y la idempotencia, no por el tono. El tono se itera con la muestra. Un mensaje duplicado se evita. La lista de promesas prohibidas iría a checks, no a consejos. Y no mediría el éxito como contención a secas: contener un hilo con una respuesta inventada es una pérdida. Con este volumen y una sola persona, el éxito es aburrido. La cola drena, los fallos se leen, la muestra no trae la misma mentira dos semanas seguidas y el cliente no repite lo que ya dijo.

Eso es operar 14.000 conversaciones. No es estar presente en cada una. Es hacer que la presencia no haga falta, y enterarse rápido cuando vuelve a hacer falta.
