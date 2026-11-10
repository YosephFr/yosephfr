// Publicación a su hora sin volver a desplegar: lo programado se dibuja oculto con data-desde
// y el navegador lo muestra cuando llega la hora (components/Revelar). MATERIAL_HASTA solo para capturas de revisión.
export const ahoraDelBuild = () => (process.env.MATERIAL_HASTA ? Date.parse(process.env.MATERIAL_HASTA) : Date.now())
export const yaSalio = (fecha: string) => Date.parse(fecha) <= ahoraDelBuild()
export const desde = (fecha: string) => ({ 'data-desde': fecha, hidden: !yaSalio(fecha) })
