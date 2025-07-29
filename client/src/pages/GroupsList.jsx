import { useState, useEffect, useMemo } from 'react';
import { Suspense } from 'react';
import { Status } from "../utils/utils";
import { useNotification } from '../contexts/NotificationContext';
import Group from "../components/Group";
import FilterSlider from "../components/FilterSlider";
import APIUtils from '../utils/APIUtils';
import "../styles/CardListContainer.css"

const GroupsList = () => {

    const { setMessage } = useNotification(); //used to control notification pop up and message
    
    const [groups, setGroups] = useState(new Map());
    const [statusFilter, setStatusFilter] = useState(Status.NONE);
    const displayedGroups = useMemo(
        () => {
            if (statusFilter === Status.NONE) return groups;
            const filteredGroups = Array.from(groups.entries()).filter(([key, value])  => 
                value.status === statusFilter
            )
            return new Map(filteredGroups);
        },
        [groups, statusFilter]
    );

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const apiResultData = await APIUtils.fetchGroups();
            const mappedGroups = new Map(
                apiResultData.map(group => [group.groupId, group])
            );
            setGroups(mappedGroups);
        } catch (error) {
            setMessage(error.message)
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    return (
        <>
        <FilterSlider onFilterChange={(status) => {setStatusFilter(status)}}/>
        <div className="card-container">
            <Suspense fallback={<p>Loading...</p>}>
                {Array.from(displayedGroups.entries()).map(([key, value]) => (
                    <Group 
                        key={key}
                        groupData={value}
                        onUpdateGroup = {(newGroupObj, isGroupErased, groupId) => {
                            const updatedGroups = new Map(groups);
                            if (isGroupErased) { //when no members remain, group is erased from DB, so delete from state
                                updatedGroups.delete(groupId);
                            } else {
                                updatedGroups.set(groupId, newGroupObj);
                            }
                            setGroups(updatedGroups);
                        }}
                    />
                ))}
            </Suspense>
        </div>
        </>
    )
}

export default GroupsList;