import { Card, List } from 'antd';
import React from 'react';

import { ListItemDataType } from '../../data.d';
import { ModalState } from '../../model';
import styles from './index.less';

const Projects: React.FC<Partial<ModalState>> = () => {

  return (
    <List<ListItemDataType>
      className={styles.coverCardList}
      rowKey="id"
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={[
        {
          "id": "fake-list-0",
          "owner": "付小小",
          "title": "私有云平台",
          "avatar": "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
          "cover": "https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png",
          "status": "active",
          "percent": 57,
          "logo": "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
          "href": "https://ant.design",
          "updatedAt": "2020-10-29T01:33:48.586Z",
          "createdAt": "2020-10-29T01:33:48.586Z",
          "subDescription": "那是一种内在的东西， 他们到达不了，也无法触及的",
          "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
          "activeUser": 147245,
          "newUser": 1256,
          "star": 173,
          "like": 138,
          "message": 18,
          "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
          "members": [
            {
              "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
              "name": "曲丽丽",
              "id": "member1"
            },
            {
              "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
              "name": "王昭君",
              "id": "member2"
            },
            {
              "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
              "name": "董娜娜",
              "id": "member3"
            }
          ]
        }
      ]}
      renderItem={(item) => (
        <List.Item>
          <Card className={styles.card} hoverable cover={<img alt={item.title} src={item.cover} />}>
            <Card.Meta title={<a>{item.title}</a>} description={item.subDescription} />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Projects;

// export default connect(({ accountAndcenter }: { accountAndcenter: ModalState }) => ({
//   list: accountAndcenter.list,
// }))(Projects);
