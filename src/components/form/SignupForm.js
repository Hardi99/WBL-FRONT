// Add a SignupForm component for user registration
import React from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';

const SignupForm = () => {
    return (
        <form>
            <Input label="Email" name="email" type="email" required />
            <Input label="Password" name="password" type="password" required />
            <Button label="Sign Up" type="submit" classes="btn__primary" />
        </form>
    );
};

export default SignupForm;