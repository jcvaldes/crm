const cursos = [
  {
      titulo: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
      tecnologia: 'JavaScript ES6',
  },
  {
      titulo: 'React – La Guía Completa: Hooks Context Redux MERN +15 Apps',
      tecnologia: 'React',
  },
  {
      titulo: 'Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s',
      tecnologia: 'Node.js'
  }, 
  {
      titulo: 'ReactJS Avanzado – FullStack React GraphQL y Apollo',
      tecnologia: 'React'
  }
];

// Resolvers
const resolvers = {
  Query: {
    // _ tiene resultados obtenidos por un resolver padre
    // input: debe llamarse tal cual a lo que defini en schema, es param entrada paso valores desde react o playground desestructurando
    // ctx: objeto que se comparte entre todos los resolvers
    // info: tiene informacion sobre la consulta actual
    obtenerCursos: (_, { input }, ctx, info ) => {
      console.log(ctx);
      const resultado = cursos.filter(c => c.tecnologia === input.tecnologia);
      return resultado;
    },
    obtenerTecnologia: () => cursos  
  }
}

module.exports = resolvers;