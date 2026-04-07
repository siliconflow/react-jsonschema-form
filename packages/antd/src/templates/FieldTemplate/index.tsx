import { Form } from 'antd';
import {
  FieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  getTemplate,
  getUiOptions,
  GenericObjectType,
  descriptionId,
} from '@rjsf/utils';

const VERTICAL_LABEL_COL = { span: 24 };
const VERTICAL_WRAPPER_COL = { span: 24 };

/** The `FieldTemplate` component is the template used by `SchemaField` to render any field. It renders the field
 * content, (label, description, children, errors and help) inside of a `WrapIfAdditional` component.
 *
 * @param props - The `FieldTemplateProps` for this component
 */
export default function FieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: FieldTemplateProps<T, S, F>) {
  const {
    children,
    description,
    displayLabel,
    errors,
    help,
    rawHelp,
    hidden,
    id,
    label,
    rawErrors,
    rawDescription,
    registry,
    required,
    schema,
    uiSchema,
    fieldPathId,
  } = props;
  const { formContext } = registry;
  const {
    colon,
    labelCol = VERTICAL_LABEL_COL,
    wrapperCol = VERTICAL_WRAPPER_COL,
    wrapperStyle,
    descriptionLocation = 'below',
  } = formContext as GenericObjectType;

  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>(
    'DescriptionFieldTemplate',
    registry,
    uiOptions,
  );
  const WrapIfAdditionalTemplate = getTemplate<'WrapIfAdditionalTemplate', T, S, F>(
    'WrapIfAdditionalTemplate',
    registry,
    uiOptions,
  );

  if (hidden) {
    return <div className='rjsf-field-hidden'>{children}</div>;
  }
  // [CUSTOM]: 隐藏制定类型的 description
  const _hideDescription = schema.type === 'array' || schema.type === 'object';
  // check to see if there is rawDescription(string) before using description(ReactNode)
  // to prevent showing a blank description area
  const descriptionNode = rawDescription ? description : undefined;
  const descriptionProps: GenericObjectType = {};
  switch (descriptionLocation) {
    case 'tooltip':
      descriptionProps.tooltip = descriptionNode;
      break;
    case 'below':
      descriptionProps.extra = descriptionNode;
      break;
    default:
      descriptionProps.extra = _hideDescription ? undefined : descriptionNode;
      break;
  }

  // [CUSTOM] label 样式
  const labelStyle: React.CSSProperties = {
    color: '#334155',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
  };

  // 将 description 整合到 label 中，显示在控件上方
  // 修复：增加 line-height 使 label 自适应高度，避免 32px 限制；处理 required 与 description 共存
  const labelWithDescription =
    rawDescription && !_hideDescription ? (
      <div style={{ lineHeight: 'normal', minWidth: 0 }}>
        <div style={{ display: 'inline', ...labelStyle }}>
          {required && (
            <span style={_hideDescription ? {} : { color: '#ff4d4f', marginLeft: '2px', fontFamily: 'SimSun' }}>*</span>
          )}{' '}
          {label}
        </div>
        <div style={{ marginTop: '2px' }}>
          <DescriptionFieldTemplate
            id={descriptionId(id) + '_inline'}
            description={rawDescription}
            schema={schema}
            uiSchema={uiSchema}
            registry={registry}
          />
        </div>
      </div>
    ) : (
      <span style={labelStyle}>{label}</span>
    );
  const isCheckbox = uiOptions.widget === 'checkbox';
  // [CUSTOM]: 只在顶级层级（非嵌套）且 type 不是 array 或 object 时显示虚线 border
  const isTopLevelField = fieldPathId.path.length === 1;
  const showBorder = isTopLevelField && !_hideDescription;
  let _displayLabel = displayLabel;
  if (schema.type === 'boolean') {
    _displayLabel = true;
  }
  return (
    <div style={showBorder ? { borderLeft: '1px dashed #CBD5E1', paddingLeft: '16px' } : undefined}>
      <WrapIfAdditionalTemplate {...props}>
        <Form.Item
          colon={colon}
          hasFeedback={schema.type !== 'array' && schema.type !== 'object'}
          help={(!!rawHelp && help) || (rawErrors?.length ? errors : undefined)}
          htmlFor={schema.type === 'boolean' ? undefined : id}
          label={_displayLabel && !isCheckbox && labelWithDescription}
          labelCol={labelCol}
          required={rawDescription && !_hideDescription ? false : required}
          style={wrapperStyle}
          validateStatus={rawErrors?.length ? 'error' : undefined}
          wrapperCol={wrapperCol}
        >
          {children}
        </Form.Item>
      </WrapIfAdditionalTemplate>
    </div>
  );
}
