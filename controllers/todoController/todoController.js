import Todo from "../../Models/Todo/Todo.js";


export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching todos" });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Error fetching todo" });
  }
};

export const addTodo = async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.files ? req.files.image : null;

    const newTodo = await Todo.create({ text, completed: false, image: image ? image.name : null });

    if (image) {
      const uploadPath = `uploads/${image.name}`;
      image.mv(uploadPath, (err) => {
        if (err) {
          return res.status(500).json({ error: "Error uploading image" });
        }
      });
    }

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Error adding todo" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    const image = req.files ? req.files.image : null;

    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    todo.text = text !== undefined ? text : todo.text;
    todo.completed = completed !== undefined ? completed : todo.completed;
    if (image) {
      todo.image = image.name;
      const uploadPath = `uploads/${image.name}`;
      image.mv(uploadPath, (err) => {
        if (err) {
          return res.status(500).json({ error: "Error uploading image" });
        }
      });
    }

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Error updating todo" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await todo.destroy();
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: "Error deleting todo" });
  }
};