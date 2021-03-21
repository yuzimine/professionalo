/**
 * User Registration Component
 */
import React from 'react';
import _ from 'lodash';
import __ from 'i18next';
import propTypes from 'prop-types';
import crypto from 'crypto';
import { withRouter } from 'next/router';

import { Input, Button, Divider, ImageEditor, Selector, Text, mlValue } from 'components/utils';
import { postApi } from 'lib/api';

class Register extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isNew: !_.has(props, 'profile'),
      id: _.has(props, 'profile.id') ? props.profile.id : '',
      langList: props.languages,
      countries: props.countries,
      isSubmitting: false,
      profile: _.has(props, 'profile') ? props.profile : {
        avatar: '',
        firstName: mlValue,
        lastName: mlValue,
        displayName: mlValue,
        title: mlValue,
        languages: '',
        city: mlValue,
        state: mlValue,
        country: '',
        linkedin: '',
        facebook: '',
        twitter: '',
        myStory: mlValue,
        expertise: '',
        email: '',
        password: '',
        password2: '',
      },
    };
  }

  async _submit() {
    const { profile, isNew } = this.state;
    const { router } = this.props;
    const id = crypto.createHash('sha1').update(profile.email).digest('hex');
    const reply = await postApi(`profile/${id}`, JSON.stringify({ profile: { ...profile, id } }));

    this.setState({ isSetting: false });
    if (_.toLower(reply) === 'success') {
      router.push(isNew ? '/api/auth/signin': `/profile/${id}`).then(() => window.scrollTo(0,0));
    } else {
      // TODO: Show some kind of error message
    }
  }

  _handleMultiLangChange(value) {
    const setValue = value.multiLangValue === true ? { pLang: value.pLang, pValue: value.pValue } : value.pValue;
    const setName = value.name;

    this.setState(prevState => ({
      ...prevState,
      id: (setName === 'email') ? crypto.createHash('sha1').update(setValue).digest('hex') : prevState.id,
      profile: {
        ...prevState.profile,
        [setName]: setValue,
      },
    }));
  }

  _handleSelectorChange(value) {
    this.setState(prevState => ({
      ...prevState,
      profile: {
        ...prevState.profile,
        [value.name]: value.pValue,
      }
    }));
  }

  _handleCancel() {
    const { isNew, id } = this.state;
    const { router } = this.props;

    router.push(isNew ? '/' : `/profile/${id}`).then(() => window.scrollTo(0,0));
  }

  _handleSubmit(event) {
    event.preventDefault();
    this.setState({ isSubmitting: true }, () => {
      this._submit();
    });
  }

  _handleSetImage(data) {
    this.setState(prevState => ({
      profile: {
        ...prevState.profile,
        avatar: data,
      }
    }));
  }

  render() {
    if (!this.state.profile) {
      return null;
    }

    const {
      id,
      isNew,
      langList,
      countries,
      isSubmitting,
      profile: {
        avatar,
        firstName,
        lastName,
        displayName,
        title,
        languages,
        city,
        state,
        country,
        linkedin,
        facebook,
        twitter,
        myStory,
        expertise,
        email,
        password,
        password2
      }} = this.state;

    return (
      <div className="register">
        <form onSubmit={event => this._handleSubmit(event)} className="register__container">
          <ImageEditor height={360} width={260} value={avatar} setImage={(data) => this._handleSetImage(data)}/>
          <section className="register__name">
            <Input
              name="firstName"
              label={__.t('First Name')}
              val={firstName}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              enableLang
              fill
              inputProps={{
                maxLength: 64,
                placeholder: __.t('Enter your given name'),
                autoComplete: 'given-name',
              }}
            />
            <Input
              name="lastName"
              label={__.t('Last Name')}
              val={lastName}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              fill
              enableLang
              inputProps={{
                maxLength: 64,
                placeholder: __.t('Enter family name'),
                autoComplete: 'family-name',
              }}
            />
            <Input
              name="displayName"
              label={__.t('Display Name')}
              val={displayName}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              fill
              enableLang
              inputProps={{
                placeholder: __.t('Enter your preferred display name'),
                maxLength: 128,
                autoComplete: 'nickname'
              }}
            />
            <Input
              name="title"
              label={__.t('Title')}
              val={title}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              fill
              enableLang
              inputProps={{
                placeholder: __.t('Enter title to be display with your name'),
                maxLength: 128,
                autoComplete: 'organization-title',
              }}
            />
            <Input
              name="city"
              label={__.t('City|Ward')}
              val={city}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              fill
              enableLang
              inputProps={{
                placeholder: __.t('Enter the city or ward of your location'),
                maxLength: 128,
                autoComplete: 'address-level2'
              }}
            />
            <Input
              name="state"
              label={__.t('State|Province|Prefecture')}
              val={state}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              fill
              enableLang
              inputProps={{
                placeholder: __.t('Enter the state, province, prefecture of your location'),
                maxLength: 128,
                autoComplete: 'address-level1'
              }}
            />
            {countries && <Selector
              name="country"
              options={countries}
              label={__.t('Country')}
              handleChange={data => this._handleSelectorChange({
                name: 'country',
                pValue: data
              })}
              value={country}
              vertical
              placeholder={__.t('Select country you are located...')}
            />}
            {langList && <Selector
              name="languages"
              options={langList}
              label={__.t('My Languages')}
              handleChange={data => this._handleSelectorChange({
                name: 'languages',
                pValue: data
              })}
              value={languages}
              isMulti
              vertical
              placeholder={__.t('Select languages you are comfortable with...')}
            />}
            <Text
              name="myStory"
              label={__.t('Descibe your story')}
              rows={10}
              val={myStory}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              fill
              enableLang
              textProps={{ placeholder: __.t('Tell us your story') }}
            />
            <Selector
              name="expertise"
              options={this.props.categories}
              // options={[
              //   { value: 'web development', label: 'Web Development' },
              //   { value: 'web design', label: 'Web Design' },
              //   { value: 'marketing strategy consultation', label: 'Marketing Strategy Consultation'},
              // ]}
              label={__.t('My Expertise')}
              handleChange={data => this._handleSelectorChange({
                name: 'expertise',
                pValue: data
              })}
              value={expertise}
              isMulti
              isClearable
              vertical
              placeholder={__.t('Select or enter your professional experience...')}
            />
          </section>
          <Divider />
          <section className="register__socialmedia">
            <Input
              name="linkedin"
              label={__.t('LinkedIn')}
              val={linkedin}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              fill
              inputProps={{
                placeholder: __.t('Enter your LinkedIn URL'),
                maxLength: 128,
                autoComplete: 'url',
              }}
            />
            <Input
              name="facebook"
              label={__.t('Facebook')}
              val={facebook}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              fill
              inputProps={{
                placeholder: __.t('Enter your Facebook URL'),
                maxLength: 128,
                autoComplete: 'url',
              }}
            />
            <Input
              name="twitter"
              label={__.t('Twitter')}
              val={twitter}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              fill
              inputProps={{
                placeholder: __.t('Enter your Twitter URL'),
                maxLength: 128,
                autoComplete: 'url',
              }}
            />
        </section>
          <Divider />
          <section className="register__credentials">
            <Input
              name="email"
              label={__.t('Your Sign-in E-Mail Address {{note}}', { note: !isNew ? __.t('(cannot be changed)') : ''})}
              val={email}
              handleChange={(value) => this._handleMultiLangChange(value)}
              vertical
              fill
              type="email"
              inputProps={{
                maxLength: 128,
                disabled: !isNew,
                autoComplete: 'email',
              }}
            />
            {!this.props.profile && 
              <>
                <Input
                  name="password"
                  label={__.t('Your Sign-in Password')}
                  val={password}
                  handleChange={(value) => this._handleMultiLangChange(value)}
                  vertical
                  fill
                  type="password"
                  inputProps={{
                    maxLength: 128,
                    autoComplete: 'new-password',
                  }}
                />
                <Input
                  name="password2"
                  label={__.t('Your Sign-in Password (confirm)')}
                  val={password2}
                  handleChange={(value) => this._handleMultiLangChange(value)}
                  vertical
                  fill
                  type="password"
                  inputProps={{
                    maxLength: 128,
                    autoComplete: 'new-password',
                  }}
                />
              </>}
          </section>
          <Divider />
          <section className="register__submit">
            <input type="hidden" name="id" value={id} />
            <Button
              size="medium"
              color="black"
              label={__.t('Cancel')}
              onClick={() => this._handleCancel()}
              disabled={this.state.isSubmitting}
            />
            <Button
              type="submit"
              size="medium"
              color="red"
              label={__.t('Submit')}
              disabled={isSubmitting}
            />
          </section>
        </form>
      </div>
    );
  }
}

export default withRouter(Register);

Register.propTypes = {
  profile: propTypes.object,
  languages: propTypes.array,
  countries: propTypes.array,
  router: propTypes.object,
  categories: propTypes.array,
};