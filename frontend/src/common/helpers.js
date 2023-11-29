import {
  DAY_IN_MILLISEC,
  TAG_SEPARATOR
} from './constants';
import timeStatuses from './enums/timeStatuses';
import taskStatuses from './enums/taskStatuses';
import { toRaw } from 'vue';

// функция, которая будет принимать строку с метками и разделять её на массив по определённому идентификатору

export const getTagsArrayFromString = tags => {
  const array = tags.split(TAG_SEPARATOR);
  return array.slice(1, array.length);
};

// функция будет получать первым параметром срок выполнения задачи (дедлайн), сравнивать его с текущим временем и возвращать статус задачи по времени.

export const getTimeStatus = dueDate => {
  if (!dueDate) {
    return '';
  }
  const currentTime = +new Date();
  const taskTime = Date.parse(dueDate);
  const timeDelta = taskTime - currentTime;
  if (timeDelta > DAY_IN_MILLISEC) {
    return '';
  }
  return timeDelta < 0 ? timeStatuses.DEADLINE : timeStatuses.EXPIRED;
};

//  функция для нормализации задач, которые приходят с сервера (преобразование структуры из одного формата в другой)

export const normalizeTask = task => {
  return {
    ...task,
    status: task.statusId ? taskStatuses[task.statusId] : '',
    timeStatus: getTimeStatus(task.dueDate)
  };
};

export const getImage = image => {
  // https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url
  return new URL(`../assets/img/${image}`, import.meta.url).href
}

// фильтрация задач в конкретной колонке
export const getTargetColumnTasks = (toColumnId, tasks) => {
  return tasks.filter(task => task.columnId === toColumnId).map(task => toRaw(task));
};

// добавляет конкретную задачу в колонку при перемещении
export const addActive = (active, toTask, tasks) => {
  const activeIndex = tasks.findIndex(task => task.id === active.id);
  if (~activeIndex) {
    tasks.splice(activeIndex, 1);
  }

  tasks.sort((a, b) => a.sortOrder - b.sortOrder);

  if (toTask) {
    const toTaskIndex = tasks.findIndex(task => task.id === toTask.id);
    tasks.splice(toTaskIndex, 0, active);
  } else {
    tasks.push(active);
  }
  return tasks;
};