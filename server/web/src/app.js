/**
 * Created by marcofalsitta on 25.06.17.
 * InterSides.net
 *
 */

let {Todo} = require('./todo');

class App {
    constructor() {
        this.heading = "Project List Manager";
        this.todos = [];
        this.todoDescription = '';
    }

    addTodo() {
        console.debug("triggered");
        if (this.todoDescription) {
            this.todos.push(new Todo(this.todoDescription));
            this.todoDescription = '';
        }
    }

    removeTodo(todo) {
        let index = this.todos.indexOf(todo);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }
}

module.exports = {
    App:App
};