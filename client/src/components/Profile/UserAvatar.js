import React from 'react'
import { Avatar } from 'rsuite'
import {Nameget} from '../../configs/helpers'

const USerAvatar = ({name, ...avatarProps}) => {
    return (
        <Avatar circle {...avatarProps}>
            {Nameget(name)}
        </Avatar>
    )
}

export default USerAvatar
