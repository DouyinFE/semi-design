import { Button } from '../';
import React from 'react'



// Export a default export named 'default' (if applicable)
export default {
    title: 'Button', // Define the title for your stories
    component: Button, // Specify the component being used in the stories
};

// Define your stories using the 'args' pattern
export const Primary = ()=>{
    return <div>
        test
        <Button/>
    </div>
}