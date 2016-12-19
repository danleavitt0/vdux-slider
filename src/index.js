import 'regenerator-runtime/runtime'
import {component, decoder, element, Window} from 'vdux'
import {Block} from 'vdux-ui'
import {Input} from 'vdux-containers'

const relativePositionDecoder = decoder(e => e.offsetX / e.target.getBoundingClientRect().width)

const roundToStep = (step) => (num) => (Math.round(num / step) * step)

export default component ({
	render ({props, state, actions}) {
		const {w = '300px', bgColor = 'blue', max = 100, name, step = 1, onChange = () => {}, ...restProps} = props
		const {value = 0, active} = state

		const percentage = (value / max) * 100
		const rounder = roundToStep(step)

		return (
			<Window onMouseUp={actions.setActive(false)}>
				<Block px='10px'>
					<Block
						py='10px'
						cursor='pointer'
						onMouseDown={relativePositionDecoder((x) => actions.toggleActive(rounder(x * max)))}
						onMouseMove={active && relativePositionDecoder((x) => actions.drag(rounder(x * max)))}
						onMouseUp={actions.setActive(false)}
						w={w}
						relative
						{...restProps}>
						<Block pointerEvents='none' wide h='2px' bgColor='darkgray'/>
						<Block pointerEvents='none' zIndex='1' h='2px' top='10px' absolute w={`${percentage}%`} bgColor={bgColor}/>
						<Block
							pointerEvents='none'
							zIndex='2'
							left={`calc(${percentage}% - 3px)`}
							top='5px'
							absolute
							circle='12px'
							transform={active ? 'scale(1.5)' : ''}
							transition='transform .2s ease-in-out'
							bgColor={bgColor}/>
						<Input onChange={onChange} h='0' visibility='hidden' name={name} value={value}/>
					</Block>
				</Block>
			</Window>
		)
	},
	onCreate ({props}) {
		if (!props.name) {
			throw new Error('Missing `name` prop')
		}
	},
	controller: {
		* drag ({props, actions, state}, x) {
			if (state.active) {
				const {max = '100'} = props
				if (x > max) {
					yield actions.setValue(max)
				} else if (x < 0) {
					yield actions.setValue(0)
				} else {
					yield actions.setValue(x)
				}
			}
		}
	},
	reducer: {
		setValue: (state, payload) => ({...state, value: payload}),
		toggleActive: (state, payload) => ({...state, active: !state.active, value: payload}),
		setActive: (state, payload) => ({...state, active: payload})
	}
})