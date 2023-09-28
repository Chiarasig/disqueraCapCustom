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

    this.on('CreateMusicians', async (req) => {
        try {
            const result = await INSERT.into(Musicians, req.data.orders)
            return console.log("the musician was created correctly", result)
        } catch (error) {
            console.log(error)
        }
    });

    this.on('DeleteMusicians', async (req) => {
        const ID = req.data.value;
        try {
            const musicians = await SELECT.from(Musicians).columns('first_name', 'last_name').where({ ID: ID });
            if (musicians){
                await DELETE.from(Musicians, {ID});
                musicians.forEach(musician => {
                    console.log(`Removed Musician with Name: ${musician.first_name} ${musician.last_name}`);
                });
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error when deleting musicians' };
        }
    }); 

    this.on('QueryMusicianByID', async (req) => {
        console.log(req.data)
        const { ID } = req.data;
        try {
            const musicians = await SELECT.from(Musicians).columns('first_name', 'last_name').where({ ID: ID });
            
            if (musicians.length > 0) {
                console.log("the musician was found")
                return musicians;
            } else {
                return { error: 'the musician was not found' };
            }
        } catch (error) {
            console.error(error);
            return { error: 'Error when consulting the musician' };
        }
    });    
});