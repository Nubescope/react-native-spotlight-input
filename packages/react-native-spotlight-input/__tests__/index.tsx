import React from 'react'
import renderer from 'react-test-renderer'

import SpotlightInput from '../src'

it('renders correctly with defaults', () => {
  const button = renderer.create(<SpotlightInput value="123" />).toJSON()
  expect(button).toMatchSnapshot()
})
