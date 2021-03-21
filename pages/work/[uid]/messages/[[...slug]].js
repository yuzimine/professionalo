import { useState, useMemo } from 'react';
import _ from 'lodash';
import __ from 'i18next';
import { useRouter } from 'next/router';
import cn from 'classnames';
import yaml from 'js-yaml';
import fs from 'fs';
import propTypes from 'prop-types';
import useSWR from 'swr';
import { nanoid } from 'nanoid';
import moment from 'moment-timezone';

import { postApi, fetcher } from 'lib/api';
import SecureLayout from 'layouts/secure-layout';
import { useUser } from 'context/userContext';
import { Button, Dialog, Input, Text, Table, mlValue } from 'components/utils';

const Messages = ({ msgConfig }) => {
  const { constants } = msgConfig;
  const context = useUser();
  const router = useRouter();
  const { uid, slug } = router.query;
  const { data: msgData, error: msgDataError } = useSWR(`/api/messages/${uid}?jobid=${slug[0]}`, fetcher);
  const [ subject, setSubject ] = useState(mlValue);
  const [ content, setContent ] = useState(mlValue);
  const [ open, setOpen ] = useState('');
  const _handleContent = value => setContent(value);
  const _handleSubject = value => setSubject(value);
  const _handleSend = (status) => {
    const opt = JSON.stringify({ data: {
      uid,
      status,
      subject,
      content,
      jobid: (slug && slug[0]) || '',
      date: moment().tz(context.tz).format('YYYY-MM-DD HH:mm:SS z'),
    }});

    postApi(`messages/${uid}`, opt)
      .then(reply => _.toLower(reply) === 'success' && setOpen(''))
      .catch(error => console.log(error));
  };
  const msgNormal = useMemo(() => (
    _.filter(msgData, md => (md.status === constants.statusUnread || md.status === constants.statusRead))
  ), [msgData, constants]);
  const msgDraft = useMemo(() => (
    _.filter(msgData, md => md.status === constants.statusDraft)
  ), [msgData, constants]);

  return (
    <SecureLayout header={slug ? 'Back' : 'Messages'} back color="red">
      <div className="messages" id="messages">

        <section className="messages__list">
          <div className={cn('menubar', 'red', 'small')}>
            <ul className="menubar__menu left">
              <li className="label">{__.t('Received Messages')}</li>
            </ul>
            <ul className="menubar__menu right">
              <li>
                <a onClick={() => setOpen('open')}>
                  <i className="fas fa-envelope"/>&nbsp;{__.t('New')}
                </a>
              </li>
            </ul>
          </div>
          <Table fill>
            <Table.Header>
              <Table.Head>{__.t('From')}</Table.Head>
              <Table.Head>{__.t('Subject')}</Table.Head>
              <Table.Head>{__.t('Date')}</Table.Head>
            </Table.Header>
            {msgNormal && _.map(msgNormal, (msg, i) => {
              return <Table.Row key={`${i}-${nanoid()}`} hoverable>
                <Table.Cell>yuzimine@me.com</Table.Cell>
                <Table.Cell>{msg.subject.pValue[context.lang]}</Table.Cell>
                <Table.Cell>2021-02-22</Table.Cell>
              </Table.Row>;
            })}
          </Table>
        </section>

        <section className="messages__list">
          <div className={cn('menubar', 'black', 'small')}>
            <ul className="menubar__menu left">
              <li className="label">{__.t('Draft Messages')}</li>
            </ul>
          </div>
          <Table fill>
            <Table.Header>
              <Table.Head>{__.t('To')}</Table.Head>
              <Table.Head>{__.t('Subject')}</Table.Head>
              <Table.Head>{__.t('Date')}</Table.Head>
            </Table.Header>
            {msgDraft && _.map(msgNormal, (msg, i) => {
              return <Table.Row key={`${i}-${nanoid()}`} hoverable>
                <Table.Cell>yuzimine@me.com</Table.Cell>
                <Table.Cell>{msg.subject.pValue[context.lang]}</Table.Cell>
                <Table.Cell>2021-02-22</Table.Cell>
              </Table.Row>;
            })}
          </Table>
        </section>

        <section className="messages__list">
          <div className={cn('menubar', 'cyan', 'small')}>
            <ul className="menubar__menu left">
              <li className="label">{__.t('Sent Messages')}</li>
            </ul>
          </div>
          <Table fill>
            <Table.Header>
              <Table.Head>{__.t('To')}</Table.Head>
              <Table.Head>{__.t('Subject')}</Table.Head>
              <Table.Head>{__.t('Date')}</Table.Head>
              <Table.Head>{__.t('Status')}</Table.Head>
            </Table.Header>
          </Table>
        </section>

        <Dialog state={open} handleClose={() => setOpen('')}>
          <div className="messages__editor">
            <Input
              name="subject"
              label={__.t('Subject')}
              val={subject}
              handleChange={_handleSubject}
              enableLang
              fill
              vertical
              defaultLang={context.lang}
              inputProps={{
                maxLength: 50,
                placeholder: __.t('Enter message subject')
              }}
            />
            <Text
              name="content"
              label={__.t('Message')}
              val={content}
              handleChange={_handleContent}
              rows={15}
              defaultLang={context.lang}
              vertical
              fill
              enableLang
              textProps={{
                placeholder: __.t('Enter message content')
              }}
            />
          </div>
          <div className="messages__attachments">
            {/* <Table fill>
              <Table.Header>
                <Table.Head>{__.t('File')}</Table.Head>
                <Table.Head>{__.t('Description')}</Table.Head>
                <Table.Head>{__.t('Embed Link')}</Table.Head>
                <Table.Head>&nbsp;</Table.Head>
              </Table.Header>
              <Table.Row>
                <Table.Cell><code>Contract_Draft1.xls</code></Table.Cell>
                <Table.Cell>Draft Contract (Revision 1)</Table.Cell>
                <Table.Cell><code>[attachment_1]</code></Table.Cell>
                <Table.Cell>
                  <i className="fas fa-trash"/>&nbsp;
                  <i className="fas fa-copy"/>
                </Table.Cell>
              </Table.Row>
            </Table>
            <Button label="Cancel" color="black" onClick={() => setOpen('')}/> */}
          </div>
          <Button
            label={__.t('Save Draft')}
            color="cyan"
            size="medium"
            onClick={() => _handleSend(msgConfig.constants.statusDraft)}
            animated
            responsive
          />
          <Button
            label={__.t('Send')}
            type="submit"
            color="red"
            size="medium"
            onClick={() => _handleSend(msgConfig.constants.statusUnread)}
            animated
            responsive
          />
        </Dialog>

      </div>
    </SecureLayout>
  );
};

export default Messages;

Messages.propTypes = {
  msgConfig: propTypes.object,
};

export async function getServerSideProps() {
  let msgConfig = {};

  try {
    msgConfig = yaml.load(fs.readFileSync(`${process.cwd()}/manifests/message.yml`, 'utf8'));
  } catch (error) {
    console.error(error);
  }
  return { props: { msgConfig } };
}