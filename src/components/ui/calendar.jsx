import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const Calendar = ({ ...props }) => {
  return <DayPicker {...props} />;
};

export { Calendar };
