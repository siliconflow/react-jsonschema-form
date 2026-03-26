import { Col, Row, Space } from 'antd';
import {
  ArrayFieldItemTemplateProps,
  FormContextType,
  getUiOptions,
  getTemplate,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';

const BTN_GRP_STYLE = {
  width: '100%',
  justifyContent: 'flex-end',
};

const BTN_STYLE = {
  width: 'calc(100% / 4)',
  gap: '8px',
};

/** The `ArrayFieldItemTemplate` component is the template used to render an items of an array.
 *
 * @param props - The `ArrayFieldItemTemplateProps` props for the component
 */
export default function ArrayFieldItemTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldItemTemplateProps<T, S, F>) {
  const { children, buttonsProps, hasToolbar, index, registry, uiSchema } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const ArrayFieldItemButtonsTemplate = getTemplate<'ArrayFieldItemButtonsTemplate', T, S, F>(
    'ArrayFieldItemButtonsTemplate',
    registry,
    uiOptions,
  );
  //  toolbarAlign = displayLabel ? 'middle' : 'top'
  const { rowGutter = 24 } = registry.formContext;
  // [CUSTOM]: 自定义 hasToolbar 展示逻辑
  const _hasToolbar = hasToolbar && !props.disabled && !props.readonly;
  // const margin = hasDescription ? -8 : 16;

  return (
    <Row align={'top'} key={`rjsf-array-item-${index}`} gutter={rowGutter}>
      <Col flex='1'>{children}</Col>
      {_hasToolbar && (
        // style={{ marginTop: displayLabel ? `${margin}px` : undefined }}
        <Col className='absolute right-0'>
          <Space.Compact style={BTN_GRP_STYLE}>
            <ArrayFieldItemButtonsTemplate {...buttonsProps} style={BTN_STYLE} />
          </Space.Compact>
        </Col>
      )}
    </Row>
  );
}
