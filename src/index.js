import 'regenerator-runtime/runtime'
import {component, decoder, element, Window} from 'vdux'
import {Block} from 'vdux-ui'
import {Input} from 'vdux-containers'

const relativePositionDecoder = decoder((e) => {
	return (e.offsetX - 15) / (e.target.getBoundingClientRect().width - 30)
})
const roundToStep = (step) => (num) => (Math.round(num / step) * step)

export default component ({
	initialState ({props}) {
		return {
			value: props.startValue || 0,
			active: false,
		}
	},
	render ({props, state, actions}) {
		const {w = '300px', bgColor = 'blue', max = 100, name, step = 1, ...restProps} = props
		const {value = 0, active} = state

		const percentage = (value / max) * 100
		const rounder = roundToStep(step)

		return (
			<Window onMouseUp={actions.setActive(false)}>
				<Block
					cursor='pointer'
					p='10px 15px'
					onMouseDown={[actions.setActive(true), relativePositionDecoder(actions.handleNewValue)]}
					onMouseMove={active && relativePositionDecoder(actions.drag)}
					onMouseUp={actions.setActive(false)}>
					<Block
						w={w}
						relative
						{...restProps}>
						<Block pointerEvents='none' wide h='2px' bgColor='darkgray'/>
						<Block pointerEvents='none' zIndex='1' h='2px' top='0px' absolute w={`${percentage}%`} bgColor={bgColor}/>
						<Block
							pointerEvents='none'
							boxShadow=''
							zIndex='2'
							left={`calc(${percentage}% - 3px)`}
							top='-5px'
							absolute
							circle='12px'
							transform={active ? 'scale(1.5)' : ''}
							transition='transform .2s ease-in-out'
							bgColor={bgColor}/>
						<Input m='0' h='0' visibility='hidden' name={name} value={value}/>
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
		* handleNewValue ({props, actions}, v) {
			const rounder = roundToStep(props.step)
			const val = normalize(rounder(v * props.max), props.max)
			yield actions.setValue(val)
			if (props.handleChange) {
				yield props.handleChange(val)
			}
		},
		* drag ({props, actions, state}, v) {
			if (state.active) {
				const {max = '100'} = props
				if (v > max) {
					yield actions.handleNewValue(max)
				} else if (v < 0) {
					yield actions.handleNewValue(0)
				} else {
					yield actions.handleNewValue(v)
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

function normalize (val, max = 100, min = 0) {
	if (val < min) {
		return min
	} else if (val > max) {
		return max
	} else {
		return val
	}
}

