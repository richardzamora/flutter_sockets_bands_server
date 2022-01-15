const {io} = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');


const bands = new Bands();
console.log('init server');

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del silencio'));
bands.addBand(new Band('Metallica'));


io.on('connection', client => {
    console.log('Client connected');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { console.log('Client disconnected') });

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);
        io.emit('mensaje', {admin: "Nuevo Mensaje"})
    })
    
    client.on("emitir-mensaje", function(payload){
        io.emit('emitir-mensaje', payload);
    })

    client.on('vote-band', (payload) =>{
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    })
    client.on('delete-band', (payload) =>{
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    })
    client.on('add-band', (payload) =>{
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    })
  });