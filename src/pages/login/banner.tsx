import React from 'react';
import { Carousel } from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';

export default function LoginBanner() {
  const t = useLocale(locale);
  const data = [
    {
      slogan: t['login.banner.slogan1'],
      subSlogan: t['login.banner.subSlogan1'],
      image:
        'https://wuchangwei.oss-cn-wulanchabu.aliyuncs.com/public/images/653be1911a053737e69f2b2d1698423186403-16984236430712433.png',
    },
    {
      slogan: t['login.banner.slogan2'],
      subSlogan: t['login.banner.subSlogan2'],
      image:
        'https://wuchangwei.oss-cn-wulanchabu.aliyuncs.com/public/images/653be1911a053737e69f2b2d1698423186622-16984236913243368.png',
    },
    {
      slogan: t['login.banner.slogan3'],
      subSlogan: t['login.banner.subSlogan3'],
      image:
        'https://wuchangwei.oss-cn-wulanchabu.aliyuncs.com/public/images/653be1911a053737e69f2b2d1698423186796-16984237276169358.png',
    },
  ];
  return (
    <Carousel className={styles.carousel} animation="fade">
      {data.map((item, index) => (
        <div key={`${index}`}>
          <div className={styles['carousel-item']}>
            <div className={styles['carousel-title']}>{item.slogan}</div>
            <div className={styles['carousel-sub-title']}>{item.subSlogan}</div>
            <img
              alt="banner-image"
              className={styles['carousel-image']}
              src={item.image}
            />
          </div>
        </div>
      ))}
    </Carousel>
  );
}
