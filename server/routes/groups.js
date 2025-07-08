const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { isAuthenticated } = require('../middleware/CheckAutheticated')
const { findGroups } = require('../systems/GroupFindAlgo');

//get user's groups 
router.get('/user/groups/', isAuthenticated, async (req, res) => {
    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: req.session.userId, 
            },
            include: { 
                groups: {include: {group: { include: {interests: true}}}}
            }
        })
        res.status(201).json(userData)
    } catch (error) {
        console.error("Error fetching groups:", error)
        res.status(500).json({ error: "Something went wrong while fetching groups." })
    }
})

//update user's status for a group
router.patch('/user/groups/:groupId', isAuthenticated, async (req, res) => {
    const groupId = parseInt(req.params.groupId);
    const {updatedStatus} = req.body; 

    try {
        const isGroup_user = await prisma.group_User.findUnique({
            where: {
                user_id_group_id: {
                    group_id: groupId,
                    user_id: req.session.userId
                }
            }
        });

        if (!isGroup_user) {
            res.status(404).json({error: 'This user - group relationship does not exist'});
        }

        const updatedGroup = await prisma.group_User.update({
            where: {
                user_id_group_id: {
                    group_id: groupId,
                    user_id: req.session.userId
                }
            },
            data: {
                status: updatedStatus
            }
        })

        res.status(200).json(updatedGroup);

    } catch (error) {
        console.error("Error updating group:", error)
        res.status(500).json({ error: "Could not update your response to this group." });
    }
})

//get new group suggestions - will be called immediately after user updates their interests
router.get('/user/newGroups/', isAuthenticated, async (req, res) => {
    const updatedUser = req.body;

    try {
        //Call GroupFindAlgo, will return all suggested groups sorted by compatibility
        const suggestedGroups = await findGroups(updatedUser); //NOTE: the interests attribute part of the returned objects won't be entirely accurate - not needed for now though
        
        //update the user_group table with these invites
        for (group of suggestedGroups) {

            const isGroup_user = await prisma.group_User.findUnique({
                where: {
                    user_id_group_id: {
                        group_id: group.id,
                        user_id: req.session.userId
                    }
                }
            });

            //only create if group_user relationship doesn't already exist
            if (!isGroup_user) {
                await prisma.group_User.create({
                    data: {
                        group: {connect: {id: group.id} },
                        user: {connect: {id: req.session.userId} },
                        status: 'PENDING' //NEED TO USE ENUM HERE
                    }
                })
            }
            
        }
        
        res.status(201).json(suggestedGroups)
    } catch (error) {
        console.error("Error fetching groups:", error)
        res.status(500).json({ error: "Something went wrong while fetching groups." })
    }
})


module.exports = router