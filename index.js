const express=require('express');
const path=require("path");
const app=express();
const sqlite3=require('sqlite3');
const PORT=3000;
app.use(express.json());
app.listen(PORT,()=>{console.log('Server run on '+PORT)})
app.get('/api/artists',async (req, res) => {
    res.send(await selectAllArtists())
})
var radios=[{
    id:1,
    name:"NRJ",
    url:"http://streamingp.shoutcast.com/NRJ-aac",
    img:"http://10.0.2.2:3000/radioimg/1.png"
},{
    id:2,
    name:"Nostalgie",
    url: "http://streamingp.shoutcast.com/NostalgiePremium",
    img:"http://10.0.2.2:3000/radioimg/2.png"
},{
    id:3,
    name:"FUN",
    url: "http://live.funradio.be/funradiobe-high.mp3",
    img:"http://10.0.2.2:3000/radioimg/3.png"
},{
    id:4,
    name:"Radio Paradise",
    url:"http://stream-uk1.radioparadise.com/aac-320",
    img: "https://cache.usercontentapp.com/logo/radioparadise.jpg?format=png&enlarge=0&quality=90&width=960"
}
];
async function selectAllAlbums() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                return console.error(err.message)
            }
            console.log("Connexion succeful to db")
        })
        const sql = 'SELECT * FROM albums'
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
            var albums = []
            rows.forEach((row) => {
                const album = {
                    AlbumId:row.AlbumId,
                    ArtistId: row.ArtistId,
                    Title: row.Title
                }
                albums.push(album);
            })
            db.close((err) => {
                if (err) return console.error(err.message)
            })
            resolve(albums);
        })
    })
}

app.get('/api/albums',async (req, res) => {
    res.send(await selectAllAlbums())
})
async function selectAllArtists() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                return console.error(err.message)
            }
            console.log("Connexion succeful to db")
        })
        const sql = 'SELECT * FROM artists'
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
            var artists = []
            rows.forEach((row) => {
                const artist = {
                    ArtistId: row.ArtistId,
                    Name: row.Name
                }
                artists.push(artist);
            })
            db.close((err) => {
                if (err) return console.error(err.message)
            })
            resolve(artists);
        })
    })
}
app.get('/api/tracks',async (req, res) => {
    res.send(await selectAllTracks());

})
async function selectAllTracks() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                return console.error(err.message)
            }
            console.log("Connexion succeful to db")
        })
        const sql = 'SELECT * FROM tracks'
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
            var tracks = []
            rows.forEach((row) => {
                const track = {
                    TrackId:row.TrackId,
                    Name: row.Name,
                    AlbumId: row.AlbumId,
                    Composer: row.Composer,
                    Milliseconds:row.Milliseconds,
                    Bytes:row.Bytes
                }
                tracks.push(track);
            })
            db.close((err) => {
                if (err) return console.error(err.message)
            })
            resolve(tracks);
        })
    })
}



app.get('/api/albumsBy=:id',async (req, res) => {
    res.send(await selectAllAlbumsFromArtist(req.params.id));
})

function selectAllAlbumsFromArtist(id) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) { return console.error(err.message) }
            console.log("Connexion succeful to db")
        })
        const sql = 'SELECT * FROM albums WHERE albums.ArtistId =  '+id;
        db.all(sql, [], (err, rows) => {
            if (err) { return console.error(err.message); reject(err); }
            var albums = []
            rows.forEach((row) => {
                const album = {
                    AlbumId:row.AlbumId,
                    ArtistId: row.ArtistId,
                    Title: row.Title
                }
                albums.push(album);
            })
            db.close((err) => {
                if (err) return console.error(err.message);
            })
            resolve(albums)
        })
    });
}
app.get('/api/trackBy=:id',async (req, res) => {
    res.send(await selectAllTracksFromAlbum(req.params.id))
})
function selectAllTracksFromAlbum(id) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) { return console.error(err.message) }
            console.log("Connexion succeful to db")
        })
        const sql = 'SELECT * FROM tracks WHERE tracks.AlbumId =  '+id;
        db.all(sql, [], (err, rows) => {
            if (err) { return console.error(err.message); reject(err); }
            var tracks = []
            rows.forEach((row) => {
                const track = {
                    TrackId:row.TrackId,
                    Name: row.Name,
                    AlbumId: row.AlbumId,
                    Composer: row.Composer,
                    Milliseconds:row.Milliseconds,
                    Bytes:row.Bytes
                }
                tracks.push(track);
            })
            db.close((err) => {
                if (err) return console.error(err.message);
            })
            resolve(tracks)
        })
    });
}
app.get('/api/artists=:name',async (req, res) => {
    res.send(await selectArtistByName(req.params.name))
})
async function selectArtistByName(name) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) { return console.error(err.message) }
            console.log("Connexion succeful to db")
        })
        const sql = `SELECT * FROM artists WHERE artists.Name LIKE "%${name}%"`;
        db.all(sql, [], (err, rows) => {
            if (err) { return console.error(err.message); reject(err); }
            var artists=[]
            rows.forEach((row)=>{
                const artist= {
                    ArtistId: row.ArtistId,
                    Name: row.Name
                }
                artists.push(artist);
            })
            db.close((err) => {
                if (err) return console.error(err.message);
            })
            resolve(artists)
        })
    });
}
app.get('/api/albums=:title',async (req, res) => {
    res.send(await selectAlbumByTitle(req.params.title))
})
async function selectAlbumByTitle(title) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) { return console.error(err.message) }
            console.log("Connexion succeful to db")
        })
        const sql = `SELECT * FROM albums WHERE albums.Title LIKE "%${title}%"`;
        db.all(sql, [], (err, rows) => {
            if (err) { return console.error(err.message); reject(err); }
            var albums = []
            rows.forEach((row) => {
                const album = {
                    AlbumId:row.AlbumId,
                    ArtistId: row.ArtistId,
                    Title: row.Title
                }
                albums.push(album);
            })
            db.close((err) => {
                if (err) return console.error(err.message);
            })
            resolve(albums)
        })
    });
}
app.get('/api/tracks=:title',async (req, res) => {
    res.send(await selectTracksByTitle(req.params.title))
})
async function selectTracksByTitle(title) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) { return console.error(err.message) }
            console.log("Connexion succeful to db")
        })
        const sql = `SELECT * FROM tracks WHERE tracks.Name LIKE "%${title}%"`;
        db.all(sql, [], (err, rows) => {
            if (err) { return console.error(err.message); reject(err); }
            var tracks = []
            rows.forEach((row) => {
                const track = {
                    TrackId:row.TrackId,
                    Name: row.Name,
                    AlbumId: row.AlbumId,
                    Composer: row.Composer,
                    Milliseconds:row.Milliseconds,
                    Bytes:row.Bytes
                }
                tracks.push(track);
            })
            db.close((err) => {
                if (err) return console.error(err.message);
            })
            resolve(tracks)
        })
    });
}
app.post('/api/artist',(req,res)=>{
    const artist={
        name:req.body.name
    }
    addArtist(artist);
    res.send(artist.name);
})
function addArtist(artist) {
    const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) { return console.error(err.message) }
        console.log("Connexion succeful to db")
    })
    const sql = `INSERT INTO artists (Name) VALUES(?);`;
    db.run(sql, [artist.name], (err) => {
        if (err) return console.error(err.message);
    });
    db.close((err) => {
        if (err) return console.error(err.message);
    })
}

function addAlbum(album) {
    const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) { return console.error(err.message) }
        console.log("Connexion succeful  for adding album to db")
    })
    const sql = `INSERT INTO albums   (ArtistId,Title)   VALUES(?,?)`;
    db.run(sql, [album.artistId,album.title], (err, rows) => {
        if (err) return console.error(err.message);

    });
    db.close((err) => {
        if (err) return console.error(err.message);
    });
}

app.post('/api/album',(req,res)=>{
    console.log(req.body.title);
    console.log(req.body.artistId);
    const album={

        title:req.body.title,
        artistId:req.body.artistId
    }
    addAlbum(album);
})
app.post('/api/track',(req,res)=>{
    const track={
        name:req.body.name,
        albumId:req.body.albumId,
        composer:req.body.composer,
        milliseconds:req.body.milliseconds,
        bytes:req.body.bytes
    }
    //addTrack(track);
    res.send(track);
});
app.get('/api/radios',(req,res)=> {
    //res.send(JSON.stringify(radios));
    //res.json(radios);
    res.send(radios);
});
app.get('/api/radio/:id',(req,res)=>{
   res.send(radios.filter((e)=>e.id=req.params.id));
});

app.delete('/api/artist=:id',(req,res)=>{
    deleteArtist(req.params.id);

})

function deleteAlbum(id) {
    const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) { return console.error(err.message) }
        console.log("Connexion succeful to db")
    })
    const sql = `DELETE FROM albums WHERE albums.AlbumId=${id}`;
    db.run(sql, [], (err, rows) => {
        if (err) return console.error(err.message);

    });
}

app.delete('/api/album=:id',(req,res)=>{
    deleteAlbum(req.params.id);

});
function deleteArtist(id) {
    const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) { return console.error(err.message) }
        console.log("Connexion succeful to db")
    })
    const sql = `DELETE FROM artists WHERE artists.ArtistId=${id}`;
    db.run(sql, [], (err) => {
        if (err) return console.error(err.message);
    });
}
app.patch('/api/artist=:id',(req,res)=>{
    const artist={
        name:req.body.name
    }
    updateArtist(artist,req.params.id);
    res.send(artist.name);
});
function updateArtist(artist ,id) {
    const db = new sqlite3.Database('albums.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) { return console.error(err.message) }
        console.log("Connexion succeful for updating artist "+id+" "+artist.name+"to db")
    })
    const sql = `UPDATE artists SET Name=? WHERE artists.ArtistId=${id}`;
    db.run(sql, [artist.name], (
        err) => {
        if (err) return console.error(err.message);
    });
}

app.use('/img',express.static('img'));
// app.get("/song/:id",(req,res)=>{
//     //res.sendFile(path.resolve('C:\\Perso\\B3\\WEB\\NODEJS\\APIFlutterProject\\img\\1.jpg'))//
//     res.sendFile('C:\\Perso\\B3\\WEB\\NODEJS\\APIFlutterProject\\song\\'+`${req.params.id}`)
// })
app.use('/song',express.static('song'));
app.use('/radioimg',express.static('radioimg'));