import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import { FaGithub, FaGoogle, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import login from '@/api/auth/login';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import tw from 'twin.macro';
import styled from 'styled-components/macro';

const Container = styled.div`
    ${tw`w-full max-w-md mx-auto`};

    background: rgba(18, 18, 26, 0.75);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 40px 32px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(99, 102, 241, 0.1);
    animation: cardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

    @keyframes cardIn {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;

const LogoBox = styled.div`
    ${tw`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl`};
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
    animation: logoPulse 3s ease-in-out infinite;

    @keyframes logoPulse {
        0%,
        100% {
            box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
        }
        50% {
            box-shadow: 0 8px 48px rgba(139, 92, 246, 0.6);
        }
    }
`;

const Divider = styled.div`
    ${tw`flex items-center gap-3 my-6`};
    color: #6b7280;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;

    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
    }
`;

const SocialGrid = styled.div`
    ${tw`grid grid-cols-2 gap-3`};
`;

const SocialButton = styled.a`
    ${tw`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all`};
    color: #fff;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-decoration: none;

    &:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
`;

const StyledInput = styled(Input)`
    ${tw`w-full py-3 px-4 rounded-xl text-sm`};
    background: rgba(0, 0, 0, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #fff !important;
    transition: all 0.25s ease;

    &:focus {
        border-color: #6366f1 !important;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15) !important;
        background: rgba(0, 0, 0, 0.5) !important;
    }
`;

const SubmitButton = styled(Button)`
    ${tw`w-full py-3 rounded-xl font-bold text-sm mt-2`};
    background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
    border: none !important;
    color: #fff !important;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(99, 102, 241, 0.5) !important;
    }

    &:active {
        transform: translateY(0) scale(0.98);
    }
`;

interface Values {
    user: string;
    password: string;
}

export default () => {
    const [showPassword, setShowPassword] = useState(false);
    const loginAction = useStoreActions((actions) => actions.user.login);
    const captcha = useStoreState((state) => state.settings.data?.captcha);

    const submit = (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
        loginAction({
            user: values.user,
            password: values.password,
            captcha: '',
        })
            .then(() => {
                // @ts-ignore
                window.location = '/';
            })
            .catch((error) => {
                setSubmitting(false);
                if (error.response?.status === 429) {
                    setErrors({
                        // @ts-ignore
                        user: 'Too many attempts. Please try again later.',
                    });
                } else if (error.response?.data?.errors?.[0]?.detail) {
                    setErrors({
                        user: error.response.data.errors[0].detail,
                    });
                }
            });
    };

    return (
        <Container>
            <SpinnerOverlay visible={false} />

            <div css={tw`text-center mb-8`}>
                <LogoBox>
                    <svg viewBox={'0 0 24 24'} fill={'none'} width={'28'} height={'28'}>
                        <path
                            d={'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'}
                            stroke={'currentColor'}
                            strokeWidth={'2'}
                            strokeLinecap={'round'}
                            strokeLinejoin={'round'}
                        />
                    </svg>
                </LogoBox>
                <h1 css={tw`text-white text-2xl font-bold mb-1`}>Welcome Back</h1>
                <p css={tw`text-neutral-400 text-xs`}>Sign in to access your panel</p>
            </div>

            <Formik
                onSubmit={submit}
                initialValues={{ user: '', password: '' }}
                validationSchema={object().shape({
                    user: string().required('Username or email is required.'),
                    password: string().required('Password is required.'),
                })}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form>
                        <div css={tw`space-y-4`}>
                            <div>
                                <Label htmlFor={'user'} css={tw`text-neutral-400 text-xs uppercase font-semibold mb-1 block`}>
                                    Username or Email
                                </Label>
                                <StyledInput
                                    id={'user'}
                                    name={'user'}
                                    type={'text'}
                                    placeholder={'Enter your credentials'}
                                    autoComplete={'username'}
                                    autoFocus
                                />
                                {touched.user && errors.user && (
                                    <p css={tw`text-red-400 text-xs mt-1`}>{errors.user}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor={'password'} css={tw`text-neutral-400 text-xs uppercase font-semibold mb-1 block`}>
                                    Password
                                </Label>
                                <div css={tw`relative`}>
                                    <StyledInput
                                        id={'password'}
                                        name={'password'}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={'••••••••'}
                                        autoComplete={'current-password'}
                                    />
                                    <button
                                        type={'button'}
                                        onClick={() => setShowPassword(!showPassword)}
                                        css={tw`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition`}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {touched.password && errors.password && (
                                    <p css={tw`text-red-400 text-xs mt-1`}>{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <SubmitButton type={'submit'} disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </SubmitButton>
                    </Form>
                )}
            </Formik>

            <Divider>OR CONTINUE WITH</Divider>

            <SocialGrid>
                <SocialButton href={'/auth/github'}>
                    <FaGithub size={18} />
                    <span>GitHub</span>
                </SocialButton>
                <SocialButton href={'/auth/google'}>
                    <FaGoogle size={18} color={'#4285F4'} />
                    <span>Google</span>
                </SocialButton>
            </SocialGrid>

            <div css={tw`flex justify-between mt-6 text-xs`}>
                <Link to={'/auth/register'} css={tw`text-neutral-400 hover:text-indigo-400 transition`}>
                    Create account
                </Link>
                <Link to={'/auth/password'} css={tw`text-neutral-400 hover:text-indigo-400 transition`}>
                    Forgot password?
                </Link>
            </div>
        </Container>
    );
};
