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
  dot as dotClass,
  end as endClass,
  avatars as avatarsClass,
  sessionItem as sessionItemClass,
  sessionItemTitle as sessionItemTitleClass,
  topicList as topicListClass,
  topic as topicClass,
  basicItemTitleDotAlign as basicItemTitleDotAlignClass,
} from 'classnames:schedule/style.css';
import months from './months';

export default class Schedule extends Component {
  constructor(props) {
    super(props);
  }
  render({ items, utcOffset }) {
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
                  <div class={timeLineClass}>
                    <div class={timeLineContentClass}>
                      {item.icon ? (
                        <div class={iconBubbleClass}>
                          <img class={iconClass} src={item.icon} alt="" />
                        </div>
                      ) : item.speakers ? (
                        <div class={iconBubbleClass}>
                          <div class={avatarsClass}>
                            {item.speakers.map(speaker => (
                              <img src={speaker.avatar} alt={speaker.name} />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div class={dotClass}></div>
                      )}
                      <h2 class={timeClass}>
                        <time>
                          {hours % 12}
                          {minutes ? ':' + minutes : ''}{' '}
                          <span class={amPmClass}>
                            {hours < 12 ? 'am' : 'pm'}
                          </span>
                        </time>
                      </h2>
                    </div>
                  </div>
                  <div class={itemClass}>
                    {item.body ? (
                      <div class={sessionItemClass}>
                        <h3 class={sessionItemTitleClass}>{item.title}</h3>
                        <div
                          dangerouslySetInnerHTML={{ __html: item.body }}
                        ></div>
                        {item.topics && (
                          <ul class={topicListClass}>
                            {item.topics.map(topic => (
                              <li>
                                <div class={topicClass}>{topic}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <h3
                        class={`${basicItemTitleClass} ${
                          !item.icon && !item.speakers
                            ? basicItemTitleDotAlignClass
                            : ''
                        }`}
                      >
                        {item.title}
                      </h3>
                    )}
                  </div>
                </>
              );
            })}

            <div class={endClass}></div>
          </div>
        ))}
      </section>
    );
  }
}
