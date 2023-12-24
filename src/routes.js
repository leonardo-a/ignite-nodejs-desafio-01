import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'
import { Database } from './database.js'
import { validateTask } from './middlewares/validate-task.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
      
      database.insert('tasks', task)
      
      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      validateTask(req, database)
      
      Object.entries(req.body).forEach(([key, value]) => {
        req.task[key] = value
      })

      req.task['updated_at'] = new Date()

      database.update('tasks', req.task)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      validateTask(req, database)

      database.delete('tasks', req.task.id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      validateTask(req, database)

      const isCompleted = !!req.task.completed_at

      database.update('tasks', {
        ...req.task,
        completed_at: isCompleted ? null : new Date(),
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
]