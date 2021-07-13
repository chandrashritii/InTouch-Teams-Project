import { auth } from '../../configs/firebase'
import firebase from 'firebase/app';
import React, {useState} from 'react'
import { Alert, Button, Icon, Tag } from 'rsuite';

const ProfileLink = () => {
    // access current user info
    const [isConnected, setIsConnected] = useState({
        'google.com' : auth.currentUser.providerData.some((data) => data.providerId === 'google.com'), 
    });

    const updateIsConnected = (providerId , value) => {
        setIsConnected(prev => {
            return {
                ...prev,
                [providerId]: value
            }
        });
    }

    const unlink = async (providerId) => {
        try {
            if(auth.currentUser.providerData.length === 1 ){
                throw new Error(`You cannot disconnect from ${providerId}`)
            }

            await auth.currentUser.unlink(providerId);
            updateIsConnected(providerId, false);
            Alert.info(`Disconnected from ${providerId}`, 4000)

        }catch(err){
            Alert.error(err.message, 4000)
        }
    }

    const unlinkGoogle = () => {
        unlink('google.com')
    }

    // return provider object
    const link = async (provider) => {
        try {
           await auth.currentUser.linkWithPopup(provider);
           Alert.info(`Linked to ${provider.providerId} `, 4000);
        
           updateIsConnected(provider.providerId, true);
        }catch(err){
            Alert.error(err.message, 4000)
        }
    }


    const linkGoogle = () => {
        link(new firebase.auth.GoogleAuthProvider())
    }

    return (
        <div>
            {isConnected["google.com"] && 
                <Tag closable color="green" onClose={unlinkGoogle}>
                        <Icon icon="google" /> Connected
                </Tag>
            }
           
            <div className="mt-2">
                {!isConnected["google.com"] && 
                    <Button className="block-socials" onClick={linkGoogle}>
                        <Icon icon="google" /> Link to Google
                    </Button>
                } 
               
            </div>
        </div>
    )
}

export default ProfileLink;
