---
title: "Rotar claves de API y alertas de gasto"
description: "Método para rotar claves de API y poner alertas de gasto cuando un agente de código puede llamar servicios de pago. Sin sorpresas en la factura."
date: "2026-10-21"
updated: "2026-10-22"
lang: es
tags:
  - seguridad
  - agentes
  - costos
draft: false
faq:
  - q: "¿Por qué un agente de código no debe usar la clave de producción?"
    a: "Porque ese agente lee repositorios, ejecuta comandos y a veces pega una clave en un log o en un archivo. La clave de producción abre el tráfico real y la factura real. El agente de código usa una identidad distinta, con techo de gasto y sin acceso a datos de clientes."
  - q: "¿Qué alerta tiene que existir antes de cortar el gasto?"
    a: "Una alerta temprana, cuando el gasto del día se sale de lo habitual, y otra cuando se acerca al techo. La primera avisa. La segunda deja tiempo para mirar. El corte duro es aparte y no espera a que alguien lea el mensaje."
  - q: "¿Cómo se rota una clave sin apagar las conversaciones?"
    a: "Se crea la clave nueva, se publica en el lugar de donde el proceso la lee, se comprueba un llamado real y recién después se revoca la vieja. Durante un rato corto las dos sirven. No se rota en el mismo minuto en que hay un incidente de gasto."
---

Una clave de API es una puerta con medidor. Quien la tiene puede llamar a un modelo o a un sistema con datos de clientes. El medidor corre igual si llama el servicio de conversaciones, un script olvidado o un agente de código que "solo estaba probando". A la escala de [unas 14.000 conversaciones al mes](/blog/operar-14000-conversaciones-de-ia), el gasto normal ya se ve. El anormal tiene que gritar antes de la factura.

Este es el método que uso. No depende de acordarme de rotar "algún día". Depende de identidades separadas, de un lugar único donde vive la clave y de alertas que disparan un corte aunque yo esté en otra cosa. Los límites de lo que el agente puede hacer, una vez que la clave es válida, están en [el código y no en el prompt](/blog/limites-de-agentes-en-codigo).

## El problema no es el modelo, es la llave

El modelo no decide cuánto se gasta. Lo decide quién puede llamarlo y con qué tope. Vi el patrón al revés más de una vez: una sola clave, copiada en el servidor, en el portátil y en el agente que ayuda a programar. Funciona hasta que alguien pega la clave en un issue, en un log de depuración o en un archivo que se sube sin querer.

A partir de ahí la clave es el permiso, no el prompt. Si está en tres sitios, hay tres formas de perderla y una sola factura. El primer trabajo es dejar un sitio por uso y ponerle nombre.

## Separar identidades

Uso identidades distintas para cosas distintas. No es una cuestión de orden estético. Es para que un accidente tenga un tamaño conocido.

- La identidad de producción solo la lee el proceso que atiende conversaciones. No está en el repositorio ni en el portátil.
- La identidad de un agente de código puede llamar a un modelo para ayudar a programar. No puede leer datos de clientes ni usar la misma cuota que el tráfico real.
- La identidad de pruebas locales tiene un techo bajo. Si se filtra, el daño es una tarde, no un mes.

Cada identidad tiene su clave, su tablero y su techo. Si el agente de código entra en bucle, se apaga esa identidad y las conversaciones siguen. Si compartieran clave, el corte apagaría las dos cosas. Ese agente lee archivos y propone comandos: pedirle que no muestre secretos es un deseo. Aunque imprima su clave, no es la de producción.

## Dónde vive la clave

La clave de producción vive en el almacén de secretos del entorno, no en un `.env` que viaja en el chat. El proceso la lee al arrancar o la refresca en caliente si el entorno lo permite. El repositorio tiene el nombre de la variable, nunca el valor.

Rotar es crear la clave nueva en el almacén, hacer que el proceso la tome y revocar la anterior cuando el llamado de prueba pasó. Si había una copia en un portátil, la revocación es mentira. Por eso la separación va primero. Al lado de cada identidad anoto qué proceso la lee. Si esa frase no cabe en una línea, hay copias de más.

## Rotación sin apagar el día

Roto en un momento aburrido, no en medio de un pico. El orden es siempre el mismo.

1. Creo la clave nueva con el mismo alcance que la vieja, no con más "por si acaso".
2. La escribo en el almacén. El proceso todavía puede usar la vieja.
3. Le digo al proceso que prefiera la nueva. Si puede convivir un rato con las dos, mejor.
4. Hago un llamado real mínimo: una conversación de prueba o un health check que use la ruta de producción, no un curl inventado en local con otra identidad.
5. Miro errores de autenticación durante un intervalo corto. Si aparecen, vuelvo a la vieja. Si no, revoco la vieja.

El intervalo con las dos claves es a propósito. Revocar antes de publicar corta el tráfico. Publicar y no revocar deja dos puertas abiertas. No roto todas las identidades el mismo día: si algo sale mal, quiero saber cuál fue. La fecha de la última rotación vive al lado del nombre. Si la respuesta a "hace cuánto" es "no me acuerdo", esa identidad se rota en la próxima ventana aburrida.

## Alertas antes del corte

El gasto tiene tres umbrales, y cada uno hace una cosa distinta. No uso un solo número que a la vez avisa y apaga, porque entonces el aviso llega tarde.

La alerta temprana compara el día con lo habitual de esa identidad. No necesita ser precisa al centavo. Necesita llegar cuando el ritmo se dobló y todavía queda margen. El mensaje dice qué identidad, cuánto lleva y desde cuándo. Sin eso, el aviso es ruido.

La alerta de techo llega cerca del máximo del día. Un pico real se nota porque también suben los hilos. Un bucle se nota porque sube el gasto y los hilos no, o porque se disparó una identidad de desarrollo.

El corte duro no pide permiso. Niega llamados nuevos de esa identidad al cruzar el techo. Prefiero que el agente diga que no puede consultar ahora antes que una factura abierta. La alerta sin corte se archiva. El corte sin alerta es un apagón. Los dos juntos son la operación.

Un esquema mínimo, sin proveedor concreto, se parece a esto:

```text
identidad: produccion | agente-codigo | local
gasto_dia >= aviso        -> notificar
gasto_dia >= cerca_techo  -> notificar y marcar
gasto_dia >= techo        -> negar llamados nuevos
```

Los números del techo no los copio de otro proyecto. Salen del gasto normal de esa identidad, con margen para un día cargado y sin margen para un bucle de horas. Si no conozco el gasto normal, el primer trabajo no es alertar. Es medir una semana.

## El agente de código, en concreto

El agente que ayuda a programar es útil y es el peor lugar para una clave ancha. Lee el diff, propone comandos y a veces ejecuta. Le doy una identidad que puede llamar a un modelo de ayuda y nada más. No le doy la clave que firma llamadas del tráfico de clientes. No le doy acceso al almacén de producción.

Si necesita probar una integración, usa la identidad local, con techo bajo y datos ficticios. Si la prueba exige producción, la hago yo y la clave no entra en su contexto. Pegar un secreto en el chat para "que lo configure" es justo el error que este método evita.

Miro sus logs como los de producción. Un agente que "arregla" un test llamando en círculo es un incidente de gasto. Si escribe documentación, la reviso por si completó un patrón con una clave. Los ejemplos llevan placeholders, nunca un valor que haya sido válido.

## Un incidente típico

El patrón es aburrido: algo falla, alguien depura, el reintento no tiene tope y una identidad llama al modelo en círculo. Si está separada, corto esa clave sin tocar el tráfico de clientes y la roto cuando el bucle ya paró. Después anoto la causa en una línea —reintento sin tope, clave en el lugar equivocado, techo tan alto que el aviso no importaba— y cambio solo eso. Si el bucle fue de producción, reviso los hilos de esa ventana: un corte puede dejarlos a medias, y el silencio no es una respuesta.

## Qué dejo funcionando

La lista que reviso cuando algo de esto se siente flojo es corta.

- Cada uso tiene su identidad y puedo decir en una frase quién la lee.
- La clave de producción no está en el portátil ni en el contexto de un agente de código.
- Hay alerta temprana, alerta de techo y corte duro, y el corte no espera una persona.
- La rotación tiene un orden: crear, publicar, probar, revocar.
- Sé la fecha de la última rotación de producción sin tener que buscar en la memoria.

El gasto de hablar con clientes, a este volumen, es un costo de operar. El gasto de una clave perdida o de un bucle no lo es. La diferencia está en separar las puertas y en ponerles un cerrojo que actúa solo. La alerta que llega cuando ya no hay nada que hacer es solo una crónica. La que llega antes, con un corte detrás, es parte del sistema.
