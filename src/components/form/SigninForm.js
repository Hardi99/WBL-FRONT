// Add a SigninForm component for user login
import React from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';

const SigninForm = () => {
    return (
        <form>
            <Input label="Email" name="email" type="email" required />
            <Input label="Password" name="password" type="password" required />
            <Button label="Sign In" type="submit" classes="btn__primary" />
        </form>
    );
};

export default SigninForm;