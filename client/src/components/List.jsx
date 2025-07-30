import { Suspense } from 'react';
import Group from "../components/Group";
import Event from "../components/Event";
import FilterSlider from "../components/FilterSlider";
import "../styles/CardListContainer.css"

const List = ({onNewFilter, displayedItems, isGroups, userTopEventType, onUpdateItems}) => {
    return (
        <>
            <FilterSlider onFilterChange={(status) => {onNewFilter(status)}}/>
            <div className="card-container">
                <Suspense fallback={<p>Loading...</p>}>
                    {!isGroups ? Array.from(displayedItems.entries()).map(([key, value]) => (
                        <Event 
                            key={key}
                            eventData={value}
                            isTopEventType={(value.event.eventType == userTopEventType)}
                            onUpdateEvent={onUpdateItems}
                        />
                    )) : 
                    Array.from(displayedItems.entries()).map(([key, value]) => (
                        <Group 
                            key={key}
                            groupData={value}
                            onUpdateGroup={onUpdateItems}
                        />
                    ))}
                </Suspense>
            </div>
        </>
    )
}

export default List;