const express = require("express");
const cors = require("cors");
const { obtenerRegistro, agregarRegistro, eliminarRegistro , actualizarLike} = require("./consulta");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/posts", async (req, res) => {
  const posts = await obtenerRegistro();
  console.log(posts);
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  const { titulo, img, descripcion, likes } = req.body;
  await agregarRegistro(titulo, img, descripcion, likes);
  res.send("Post agregado con éxito");
});

app.delete("/posts:id", async (req, res) => {
  try {
    const { id } = req.body;
    await eliminarRegistro(id);
    res.send("Post eliminado con éxito");
  } catch (error) {
    res.status(500).send(error.detail);
  }
});

app.put('/posts/:id/like', async (req, res) => {
    try {
      const { id } = req.params; 
      const { likes } = req.body;
  
      if (likes === undefined) {
        return res.status(400).json({ error: 'Debe proporcionar el número de likes' });
      }
  
      const postActualizado = await actualizarLike(id, likes);
  
      return res.status(200).json({
        message: 'Post actualizado correctamente',
        post: postActualizado,
      });
    } catch (error) {
      console.error('Error en la actualización de likes:', error);
      return res.status(500).json({ error: error.message });
    }
  });