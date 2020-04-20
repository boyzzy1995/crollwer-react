import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Store } from 'antd/lib/form/interface';
import './login.css';
import request from '../../request';
import qs from 'qs';
import { Redirect } from 'react-router-dom';

interface FormData extends Store {
  password?: string;
}

class Login extends Component {
  state = { isLogin: false };
  onFinish = (values: FormData): void => {
    request
      .post(
        '/api/login',
        qs.stringify({
          password: values.password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((res: any) => {
        const data: boolean = res.data;
        if (data) {
          this.setState({
            isLogin: true,
          });
        } else {
          message.error(res.msg);
        }
      });
  };

  render() {
    return this.state.isLogin ? (
      <Redirect to='/'></Redirect>
    ) : (
      <div className='login-wrapper'>
        <Form
          name='normal_login'
          className='login-form'
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
              name='password'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Login;
