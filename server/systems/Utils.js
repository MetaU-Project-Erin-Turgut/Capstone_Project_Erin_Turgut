const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const getExpandedInterests = async (originalInterests, isGroup) => {
    let expandedInterestSet = [];

    for (const interest of originalInterests) { 
        let currInterest = interest;
        if (isGroup) currInterest = interest.interest;

        if (currInterest.parent_id == null) continue;

        //query for interest ancestry path for each original interest
        const path = await prisma.interest.findUnique({
            where: {id: currInterest.id},
            select: {
                path: true
            }
        })
        
        //use path field to avoid recursive calls to get entire hierarchy 
        const pathParsed = path.path.split('.').map((id) => {
            return parseInt(id);
        })

        pathParsed.pop(); //don't need to include original interest again

        //get the actual interest objects of these ancestor ids
        const ancestorInterests = await prisma.interest.findMany({
            where: {id: { in: pathParsed}}
        })

        expandedInterestSet = [currInterest, ...expandedInterestSet, ...ancestorInterests]; //expand user's interest set to now include ancestor interests
    }
    return [expandedInterestSet];
}

const getUnionOfSets = (groupInterests, userInterests) => {
    const groupIds = groupInterests.map((group) => {
        return group.interest.id;
    })
    const interestIds = userInterests.map((interest) => {
        return interest.id;
    })

    const groupInterestsSet = new Set(groupIds);
    return groupInterestsSet.union(new Set(interestIds));
}

module.exports = { getExpandedInterests, getUnionOfSets};