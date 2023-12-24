export function validateTask(req, database) {
  const { id } = req.params

  const task = database.select('tasks', { id })[0]

  if(!task) {
    return res.writeHead(404).end()
  }

  req.task = task
}