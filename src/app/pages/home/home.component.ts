import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
type Task = {
  id: string;
  title: string;
  completed: boolean;
  editing: boolean;
};
type TFilter = 'all' | 'pending' | 'completed';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  tasksFilter: TFilter = 'all';

  tasksFiltered = this.tasks.filter((task) => {
    if (this.tasksFilter === 'pending') return !task.completed;
    if (this.tasksFilter === 'completed') return task.completed;
    return true;
  });
  constructor(private route: ActivatedRoute) {}
  OnChanges(): void {
    this.tasksFiltered = this.tasks.filter((task) => {
      if (this.tasksFilter === 'pending') return !task.completed;
      if (this.tasksFilter === 'completed') return task.completed;
      return true;
    });
  }
  ngOnInit(): void {
    console.log(this.tasksFiltered);
    const getLocalStorage = localStorage.getItem('mydayapp-angular');
    if (getLocalStorage) {
      this.tasks = JSON.parse(getLocalStorage);
      this.OnChanges();
    }
    this.route.queryParamMap.subscribe((params) => {
      const filter = params.get('filter');
      if (filter) {
        this.changeFilter(filter as TFilter);
      }
    });
  }
  private updateLocalStorage() {
    localStorage.setItem('mydayapp-angular', JSON.stringify(this.tasks));
    this.OnChanges();
  }
  private generateId() {
    return Math.floor(Math.random() * 100000);
  }
  addHandler(event: any) {
    const value = event.target.value;
    if (value.trim() === '') return;
    const newTask: Task = {
      id: this.generateId().toString() + Date.now().toString(),
      title: value.trim(),
      completed: false,
      editing: false,
    };
    this.addTask(newTask);
    event.target.value = '';
  }
  handlerEdit(id: string) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, editing: true } : { ...task, editing: false }
    );
    this.updateLocalStorage();
  }
  handleEditCompletion(event: any, id: string) {
    const value = event.target.value;
    if (value.trim() === '') return;
    this.editTask(id, value.trim());
  }
  toggleChecked(id: string) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.updateLocalStorage();
  }
  addTask(task: Task) {
    this.tasks.push(task);
    this.updateLocalStorage();
  }
  deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.updateLocalStorage();
  }
  editTask(id: string, title: string) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, title, editing: false } : task
    );
    this.updateLocalStorage();
  }
  clearTasks() {
    this.tasks = this.tasks.filter((task) => !task.completed);
    this.updateLocalStorage();
  }
  changeFilter(filter: TFilter) {
    this.tasksFilter = filter;

    this.OnChanges();
  }
  taskPending() {
    return this.tasks.filter((task) => !task.completed).length;
  }

  thereIsCompleted() {
    return this.tasks.some((task) => task.completed);
  }
}
