const cds = require('@sap/cds');

module.exports = cds.service.impl (async function() {
    let { Musicians } = this.entities;

    this.after('READ', 'Sessions', (req) => {
        for (let i = 0; i < req.length; i++) {
            const session = req[i];
            if (session.hours >= 6) {
                session.hasFreeHours = true; 
            }
        }
    });

    this.on('CrearMusicos', async (req) => {
        try {
            const result = await INSERT.into(Musicians, req.data.orders)
            return console.log("se creó el músico correctamente", result)
        } catch (error) {
            console.log(error)
        }
    });

    this.on('DeleteMusicians', async (req) => {
        const ID = req.data.value;
        console.log(req.data.value)
        try {
            const musicians = await SELECT.from(Musicians).columns('first_name', 'last_name').where({ ID: ID });
            console.log(musicians, "musicians")
            if (musicians){
                await DELETE.from(Musicians, {ID});
                console.log("acá")
                musicians.forEach(musician => {
                    console.log(`Músico eliminado con Nombre: ${musician.first_name} ${musician.last_name}`);
                });
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al eliminar músicos' };
        }
    }); 

    this.on('ConsultaMusicoPorID', async (req) => {
        console.log(req.data)
        const { ID } = req.data;
        try {
            const musicians = await SELECT.from(Musicians).columns('first_name', 'last_name').where({ ID: ID });
            
            if (musicians.length > 0) {
                console.log("se encontró el músico")
                return musicians;
            } else {
                return { error: 'Músico no encontrado' };
            }
        } catch (error) {
            console.error(error);
            return { error: 'Error al consultar el músico' };
        }
    });    
});