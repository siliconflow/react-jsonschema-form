import classNames from 'classnames';
import {
  FormContextType,
  TitleFieldProps,
  RJSFSchema,
  StrictRJSFSchema,
  getTemplate,
  getUiOptions,
  descriptionId,
} from '@rjsf/utils';
import { Col, Row, ConfigProvider } from 'antd';
import { useContext } from 'react';

/** The `TitleField` is the template to use to render the title of a field
 *
 * @param props - The `TitleFieldProps` for this component
 */
export default function TitleField<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  id,
  required,
  registry,
  title,
  optionalDataControl,
  schema,
  uiSchema,
}: TitleFieldProps<T, S, F>) {
  const { formContext } = registry;
  const { colon = true } = formContext;

  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>(
    'DescriptionFieldTemplate',
    registry,
    uiOptions,
  );

  let labelChildren = title;
  if (colon && typeof title === 'string' && title.trim() !== '') {
    labelChildren = title.replace(/[：:]\s*$/, '');
  }

  const handleLabelClick = () => {
    if (!id) {
      return;
    }

    const control: HTMLLabelElement | null = document.querySelector(`[id="${id}"]`);
    if (control && control.focus) {
      control.focus();
    }
  };

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('form');
  const labelClassName = classNames({
    [`${prefixCls}-item-required`]: required,
    [`${prefixCls}-item-no-colon`]: !colon,
  });
  let heading = title ? (
    <label
      className={labelClassName}
      htmlFor={id}
      onClick={handleLabelClick}
      title={typeof title === 'string' ? title : ''}
    >
      {typeof labelChildren === 'string' ? (
        <DescriptionFieldTemplate
          id={descriptionId(id)}
          description={labelChildren}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      ) : (
        labelChildren
      )}
    </label>
  ) : null;
  if (optionalDataControl) {
    heading = (
      <Row>
        <Col flex='auto'>{heading}</Col>
        <Col flex='none'>{optionalDataControl}</Col>
      </Row>
    );
  }

  return <>{heading}</>;
}
