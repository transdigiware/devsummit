import { h, Component, Fragment } from 'preact';

import {
  schedule as scheduleClass,
  day as dayClass,
  date as dateClass,
  dateName as dateNameClass,
  dateNumber as dateNumberClass,
  dayTitle as dayTitleClass,
  dayNumber as dayNumberClass,
  timeLine as timeLineClass,
  dayGap as dayGapClass,
  time as timeClass,
  amPm as amPmClass,
  timeLineContent as timeLineContentClass,
  iconBubble as iconBubbleClass,
  icon as iconClass,
  item as itemClass,
  basicItemTitle as basicItemTitleClass,
} from 'classnames:schedule/style.css';
import months from './months';
import coffeeImg from 'asset-url:../assets/coffee.svg';

export default class Schedule extends Component {
  constructor(props) {
    super(props);
  }
  render({ items }) {
    const utcOffset = self.confUtcOffset;
    let currentMonth = '';
    let currentDate = 0;

    const days = [];
    let day;

    for (const item of items) {
      const itemDate = new Date(item.start + utcOffset);
      const date = itemDate.getUTCDate();
      const month = itemDate.getUTCMonth();

      if (date !== currentDate || month !== currentMonth) {
        currentDate = date;
        currentMonth = month;
        day = { date, month, items: [] };
        days.push(day);
      }

      day.items.push(item);
    }

    return (
      <section class={scheduleClass}>
        {days.map(({ date, month, items }, dayNum) => (
          <div class={dayClass}>
            <h1 class={dateClass}>
              <span class={dateNameClass}>{months[month]}</span>
              <span class={dateNumberClass}>{date}</span>
            </h1>
            <div class={dayTitleClass}>
              Day <span class={dayNumberClass}>{dayNum + 1}</span>
            </div>

            <div class={`${timeLineClass} ${dayGapClass}`}></div>

            {items.map(item => {
              const sessionDate = new Date(item.start + utcOffset);
              const hours = sessionDate.getUTCHours();
              const minutes = sessionDate.getUTCMinutes();

              return (
                <>
                  <h2 class={timeClass}>
                    <time>
                      {hours % 12}
                      {minutes ? ':' + minutes : ''}{' '}
                      <span class={amPmClass}>{hours < 12 ? 'am' : 'pm'}</span>
                    </time>
                  </h2>
                  <div class={timeLineClass}>
                    <div class={timeLineContentClass}>
                      <div class={iconBubbleClass}>
                        <img class={iconClass} src={coffeeImg} alt="" />
                      </div>
                    </div>
                  </div>
                  <div class={itemClass}>
                    <h3 class={basicItemTitleClass}>{item.title}</h3>
                  </div>
                </>
              );
            })}
          </div>
        ))}
      </section>
    );
  }
}
