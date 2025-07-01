///-------------------NEW APPROACH (see below for original layout)--------------------///
/*
1. Start in interest tree at user's interest
2. At that interest field, filter by incomplete groups AND groups within area. Then I should have the most 
compatible groups for the user. Store these and mark them as 100% compatibility
3. Continue going up the tree and at each parent interest repeat step 2.
4. Depending on height of branch, mark these marked groups by their level/percentage of compatibility
5. Notify user of group invitations and have them show up in their groups tab

NOTE: Maybe stop going up the tree once you have a certain amount of groups selected for the user.

User behvior addition: 
-Once you have narrowed down the groups within an interest node, further sort them by closest overall event type
interest to the user. This data is determined by events users have accpeted and rejected. Events are classified into
smaller categories ("Active", "Entertainment", "Food/Drink", "Nightlife") and when users join a group, the group's overall liked events may change. 
    -This could also create interesting opportunty for search criteria for the second technical challenge
NOTE: Need to decide if this data pertaining to user and to an event is visible. Or groups are just order by most
compatible.


*/

///---------------------------------ORIGINAL LAYOUT----------------------------------///

//Step 1: Filter only incomplete groups
    //edge case: if none, create new one


//Step 2: Filter groups within specified radius
    //Need efficient way to narrow down all groups by ones within a radius - NPM Package?
    //edge case: if none, create new one


//Step 3: Sort remaining groups by closest core interest to user's interest
    //have level field for interest?
    //go through each group and calculate distance from user's interest


//Step 4: Invite user to top 3 groups


//Step 5: When user accepts group, need to adjust the group's central location and core interest
    //Need to find the median point between the group's central location and user's location. - NPM Package?
    //Need to adjust group's core interest up or down the interest tree
