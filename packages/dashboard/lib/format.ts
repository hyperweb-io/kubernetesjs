import { ReactElement } from 'react';
import dayjs from 'dayjs';

const BASE_PATH = '/public';

export const trimPath = (path: string) => {
  if (path.startsWith(BASE_PATH)) return path.slice(BASE_PATH.length);
  return path;
};

const pluralize = (qty: number, word: string) => {
  return qty === 1 ? `1 ${word}` : `${qty} ${word}s`;
};

const isDurationValid = (duration: string) => {
  const splitted = duration.split(':').map(Number);
  const isValidNumber = splitted.every((val) => !Number.isNaN(val) && Number.isInteger(val) && val >= 0);
  const isMinAndSecBelow60 = splitted.slice(-2).every((val) => val < 60);
  return splitted.length <= 3 && isValidNumber && isMinAndSecBelow60;
};

export const formatDuration = (duration: string) => {
  if (!isDurationValid(duration)) {
    throw Error(`not a valid duration: ${duration}`);
  }

  const totalSeconds = duration
    .split(':')
    .map(Number)
    .reverse()
    .reduce((a, b, i) => a + b * 60 ** i);

  switch (true) {
    case totalSeconds >= 3600: {
      const h = (totalSeconds / 3600).toFixed(1);
      return pluralize(Number(h), 'hour');
    }

    case totalSeconds >= 60: {
      const m = Math.floor(totalSeconds / 60);
      return pluralize(m, 'minute');
    }

    default:
      return pluralize(totalSeconds, 'second');
  }
};

const getInteger = (num: number) => num.toString().split('.')[0];

const durationToSeconds = (duration: string) =>
  duration
    .split(':')
    .map(Number)
    .reverse()
    .reduce((prev, cur, i) => prev + cur * 60 ** i);

export const getTotalDuration = (durations: string[]) => {
  durations.forEach((duration) => {
    if (!isDurationValid(duration)) {
      throw Error(`not a valid duration: ${duration}`);
    }
  });

  const totalSeconds = durations.map(durationToSeconds).reduce((a, b) => a + b);

  const h = getInteger(totalSeconds / 3600);
  const m = getInteger((totalSeconds % 3600) / 60);
  const s = (totalSeconds % 3600) % 60;

  return formatDuration([h, m, s].join(':'));
};

export const formatBlogDate = (dateString: string): string => {
  const date = dayjs(dateString);
  const currentYear = dayjs().year();
  const isCurrentYear = date.year() === currentYear;

  return date.format(`MMM D${isCurrentYear ? '' : ', YYYY'}`);
};

export const getFilenameFromPath = (path: string) => {
  return (path.split('/').pop() || '').split('.')[0];
};

export const capitalToKebabCase = (str: string) => {
  return str
    .trim()
    .split(' ')
    .map((word) => word.toLowerCase())
    .join('-');
};

export const getChildrenString = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }

  if (typeof children === 'object' && !Array.isArray(children)) {
    return getChildrenString((children as ReactElement).props.children);
  }

  if (Array.isArray(children)) {
    return children.reduce((acc, child) => acc + getChildrenString(child), '');
  }

  return '';
};

export const getHeadingId = (children: React.ReactNode): string => {
  return getChildrenString(children)
    .toLowerCase()
    .replace(/[^a-zA-Z0-9- _]/g, '')
    .replace(/ /g, '-');
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
