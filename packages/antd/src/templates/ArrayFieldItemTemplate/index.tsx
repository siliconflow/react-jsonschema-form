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
};

const BTN_STYLE = {
  width: 'calc(100% / 4)',
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
  const { rowGutter = 24, toolbarAlign = 'top' } = registry.formContext;

  const _hasToolbar = hasToolbar && (!props.disabled && !props.readonly);
  return (
    <Row align={toolbarAlign} key={`rjsf-array-item-${index}`} gutter={rowGutter} style={{position: 'relative', border: '1px solid #e2e8f0', margin: "8px", borderRadius: "6px"}}>
      <Col flex='1'>{children}</Col>

      {/* {hasToolbar && (
        <Col flex='192px'>
          <Space.Compact style={BTN_GRP_STYLE}>
            <ArrayFieldItemButtonsTemplate {...buttonsProps} style={BTN_STYLE} />
          </Space.Compact>
        </Col>
      )} */}
      {_hasToolbar && (
        <Col style={{position: 'absolute', top: 5, right: 5, display: 'flex', gap: '5px'}}>
            <ArrayFieldItemButtonsTemplate {...buttonsProps} style={BTN_STYLE} />
        </Col>
      )}
    </Row>
  );
}
