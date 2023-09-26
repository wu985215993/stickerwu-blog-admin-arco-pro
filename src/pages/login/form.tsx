import {
  Form,
  Input,
  Checkbox,
  Link,
  Button,
  Space,
  Grid,
  Message,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser, IconImage } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import useStorage from '@/utils/useStorage';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import { requestCaptcha, requestLogin } from '@/services/loginService';

const { Row, Col } = Grid;
export default function LoginForm() {
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaSvg, setCaptchaSvg] = useState(null);
  const [loginParams, setLoginParams, removeLoginParams] =
    useStorage('loginParams');
  /** 国际化 */
  const t = useLocale(locale);
  // TODO 记住密码
  // const [rememberPassword, setRememberPassword] = useState(!!loginParams);

  function afterLoginSuccess() {
    // TODO 记住密码
    // if (rememberPassword) {
    //   setLoginParams(JSON.stringify(params));
    // } else {
    //   removeLoginParams();
    // }
    // TODO 记录登录状态
    // localStorage.setItem('userStatus', 'login');
    Message.success('登录成功');
    // 跳转首页
    window.location.href = '/';
  }
  /** 获取验证码 */
  async function reFreshCaptcha() {
    const svg = await requestCaptcha();
    setCaptchaSvg(svg);
  }

  function login({ loginId, loginPwd, captcha, remember }) {
    setErrorMessage('');
    setLoading(true);
    requestLogin({ loginId, loginPwd, captcha, remember: remember ? 7 : 0 })
      .then((res) => {
        const { data, msg } = res;
        if (data) {
          afterLoginSuccess();
        } else {
          /** 登录失败重新刷新验证码 */
          reFreshCaptcha();
          setErrorMessage(msg || t['login.form.login.errMsg']);
        }
      })
      .catch(() => {
        /** 登录失败重新刷新验证码 */
        reFreshCaptcha();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      login(values);
    });
  }

  useEffect(() => {
    // 首次进入获取验证码
    reFreshCaptcha();
  }, []);
  // 读取 localStorage，设置初始值 TODO记住密码
  // useEffect(() => {
  //   const rememberPassword = !!loginParams;
  //   setRememberPassword(rememberPassword);
  //   if (formRef.current && rememberPassword) {
  //     const parseParams = JSON.parse(loginParams);
  //     formRef.current.setFieldsValue(parseParams);
  //   }
  // }, [loginParams]);

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>{t['login.form.title']}</div>
      <div className={styles['login-form-sub-title']}>
        {t['login.form.title']}
      </div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form
        className={styles['login-form']}
        layout="vertical"
        ref={formRef}
        initialValues={{ required: 'admin', password: 'loginPwd' }}
        size="large"
      >
        <Form.Item
          field="loginId"
          rules={[{ required: true, message: t['login.form.userName.errMsg'] }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder={t['login.form.userName.placeholder']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="loginPwd"
          rules={[{ required: true, message: t['login.form.password.errMsg'] }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={t['login.form.password.placeholder']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Row>
          <Col span={14}>
            <Form.Item
              field="captcha"
              rules={[
                { required: true, message: t['login.form.captcha.errMsg'] },
              ]}
            >
              <Input
                prefix={<IconImage />}
                placeholder={t['login.form.captcha.placeholder']}
                onPressEnter={onSubmitClick}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <div
              onClick={reFreshCaptcha}
              className={styles.captcha}
              dangerouslySetInnerHTML={{ __html: captchaSvg }}
            />
          </Col>
        </Row>
        <Space size={16} direction="vertical">
          <div className={styles['login-form-password-actions']}>
            <Form.Item field="remember">
              <Checkbox>{t['login.form.remember7days']}</Checkbox>
            </Form.Item>
          </div>
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            {t['login.form.login']}
          </Button>
        </Space>
      </Form>
    </div>
  );
}
