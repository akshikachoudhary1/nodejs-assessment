/**
 * File: dateUtils.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Utility functions for date and time parsing. Converts day and time into a JavaScript Date object.
 */


/**
 * Converts a given day (date or weekday) and time into a JavaScript Date object.
 * Example: ('2025-08-01', '14:00') or ('Monday', '09:30')
 * Returns a Date object for the next matching day and time.
 */
function parseDayTimeToDate(day, time) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return new Date(`${day}T${time}:00`);
  }
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const todayIdx = now.getDay();
  const targetIdx = daysOfWeek.findIndex(d => d.toLowerCase() === day.toLowerCase());
  if (targetIdx === -1) return null;
  let daysToAdd = (targetIdx - todayIdx + 7) % 7;
  if (daysToAdd === 0 && new Date(now.toDateString() + ' ' + time) <= now) daysToAdd = 7;
  const targetDate = new Date(now);
  const [hours, minutes] = time.split(':').map(Number);
  targetDate.setDate(now.getDate() + daysToAdd);
  targetDate.setHours(hours, minutes, 0, 0);
  return targetDate;
}

module.exports = { parseDayTimeToDate };
