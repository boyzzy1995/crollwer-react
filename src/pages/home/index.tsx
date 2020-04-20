import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import './home.css';
import request from '../../request';
import { Redirect } from 'react-router-dom';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

interface CourseItem {
  title: string;
  count: number;
}

interface DataList {
  [key: string]: CourseItem[];
}

export default () => {
  const dataList: DataList = {};
  const [isLogin, setLoginState] = useState(true);
  const [data, setData] = useState(dataList);
  useEffect(() => {
    request.get('/api/isLogin').then((res) => {
      setLoginState(res.data);
    });
  });
  useEffect(() => {
    request.get('/api/showData').then((res: any) => {
      const data: DataList | boolean = res.data;
      if (data) {
        setData(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);
  const handleLogoutClick = () => {
    request.post('/api/logout').then((res) => {
      const data: boolean = res.data;
      setLoginState(data);
    });
  };
  const handleCrowllerClick = () => {
    request.get('/api/getData').then((res) => {
      const data: boolean = res.data;
      if (data) {
        message.success('爬取成功');
      }
    });
  };
  const getOptions: () => echarts.EChartOption = () => {
    const times: string[] = [];
    const itemNames: string[] = [];
    const tempData: {
      [key: string]: number[];
    } = {};
    const result: echarts.EChartOption.Series[] = [];
    for (let key in data) {
      times.push(moment(Number(key)).format('MM-DD HH:mm'));
      data[key].forEach((item) => {
        const { title, count } = item;
        if (!itemNames.includes(title)) {
          itemNames.push(title);
        }
        tempData[title]
          ? tempData[title].push(count)
          : (tempData[title] = [count]);
      });
    }
    for (let key in tempData) {
      result.push({
        name: key,
        type: 'line',
        data: tempData[key],
      });
    }
    return {
      title: {
        text: '课程在线学习人数',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: itemNames,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times,
      },
      yAxis: {
        type: 'value',
      },
      series: result,
    };
  };
  if (isLogin) {
    return (
      <div className='home-wrapper'>
        <div className='button-group'>
          <Button type='primary' onClick={handleCrowllerClick}>
            爬取
          </Button>
          <Button type='primary' onClick={handleLogoutClick}>
            退出
          </Button>
        </div>
        <div className='echarts'>
          <ReactEcharts option={getOptions()}></ReactEcharts>
        </div>
      </div>
    );
  } else {
    return <Redirect to='/login'></Redirect>;
  }
};
