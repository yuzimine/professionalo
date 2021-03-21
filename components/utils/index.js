import Button from './button';
import LinkButton from './linkButton';
import Divider from './divider';
import Input from './input';
import Quote from './quote';
import Selector from './selector';
import Dialog from './dialog';
import Generate from './generate';
import Text from './text';
import MlLabel from './mllabel';
import Checkbox from './checkbox';
import Radiobox from './radiobox';
import Table from './table';
import Card from './card';
import Stats from './stats';
import Label from './label';
import ImageEditor from './imageEditor';
import BgVideo from './bgvideo';
import ListCard from './listcard';

const mlValue = {
  pLang: ['en', 'ja'],
  pValue: {
    en: '',
    ja: '',
  },
};

export {
  mlValue,
  Button,
  Dialog,
  Divider,
  LinkButton,
  Input,
  Quote,
  Selector,
  Text,
  Generate,
  MlLabel,
  Checkbox,
  Radiobox,
  Table,
  Card,
  Stats,
  Label,
  ImageEditor,
  BgVideo,
  ListCard,
};

const dynamicComponent = {
  'Button': Button,
  'Dialog': Dialog,
  'Divider': Divider,
  'LinkButton': LinkButton,
  'Input': Input,
  'Quote': Quote,
  'Selector': Selector,
  'Text': Text,
  'MlLabel': MlLabel,
  'Checkbox': Checkbox,
  'Radiobox': Radiobox,
  'Table': Table,
  'Card': Card,
  'Stats': Stats,
  'Label': Label,
  'ImageEditor': ImageEditor,
  'BgVideo': BgVideo,
  'ListCard': ListCard,
};

export default dynamicComponent;
