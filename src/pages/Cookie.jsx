import {useState, useEffect, } from 'react';
import {compose, add, mult, sub, pairs, fromPairs, fst, map, pipe, Pair, snd, reduce } from 'sanctuary';
import remi from '../images/remi.jpg';
const center = {display: 'grid', placeItems: 'center'};
const noButton = {borderStyle: 'none', background: '#fff', fontSize: '1em'};

const Cookie = ({onClick, ...rest}) => 
	<button onClick={onClick} style={{...noButton}}>
		<img {...rest} src={remi} alt="cookie" />
	</button>;

const mults = {
	0: 1.25,
	11: 1.15,
	20: 1.05,
	50: 1.03,
	100: 1.02,
	150: 1.01,
	200: 1.005,
	250: 1.001,
	300: 1.0001,
	350: 1.00001,
	400: 1.00000000001,
	500: 1.000000000000000000000000000000000000000001,
};

const thing = n => acc => val => (fst (val) >= n) ? acc : val;
const highestSmallerThan = n => pipe([
	pairs,
	map (p => Pair (parseInt (fst (p))) (snd (p))),
	reduce (thing (n)) (Pair (0) (1.25)),
	snd,
]);

const remiSizeAlgo = clicks => {
	const constant = clicks === 0 ? 10 : 1;
	const multiplier = highestSmallerThan (clicks) (mults);
	return compose (add (constant)) (mult (multiplier)) (clicks);
};

const productiveForces = [
	{ 
		name: 'well meaning experimental poet', cps: 0.15, cost: 15,
		hireText: (
			'Technoscientific innovation must be linked to a collective theoretical and political thinking in which women, queers, and the gender non-conforming play an unparalleled role.'
		),
	},
	{ 
		name: 'full stack javascripter', cps: 0.69, cost: 50, 
		hireText: (
			'The dominance of the visual in today’s online interfaces has reinstated familiar modes of identity policing, power relations and gender norms in self-representation.'
		),
	},
	{ 
		name: 'schemer', cps: 2, cost: 175, 
		hireText: (
			'We ask whether the idiom of ‘gender hacking’ is extensible into a long-range strategy, a strategy for wetware akin to what hacker culture has already done for software–constructing an entire universe of free and open source platforms that is the closest thing to a practicable communism many of us have ever seen.'
		),
	},
	{ 
		name: 'clojurescripter', cps: 20, cost: 1000, 
		hireText: (
			'a feminism of unprecedented cunning, scale, and vision; a future in which the realization of gender justice and feminist emancipation contribute to a universalist politics assembled from the needs of every human, cutting across race, ability, economic standing, and geographical position.'
		),
	},
	{ 
		name: 'Helen Hester', cps: 10000, cost: 10000, 
		hireText: (
			'a feminism of unprecedented cunning, scale, and vision; a future in which the realization of gender justice and feminist emancipation contribute to a universalist politics assembled from the needs of every human, cutting across race, ability, economic standing, and geographical position.'
		),
	},
];

const available = n => p => p.cost <= n;

const Producer = props => {
	const {name, active, cps, cost, nHired, postMessage, hireText, onHire} = props;
	const handleHire = _ => {
		if (!active) {return;}
		postMessage(hireText);
		onHire ({cps, cost});
	};
	return (
		<li style={{padding: 0, }}>
			<button style={noButton} onClick={handleHire}>
				<span style={{color: active ? '#000' : '#777'}}>
					{name}{nHired > 0 && `s ${nHired}`}
				</span>
			</button>
		</li>
	);
};

const useMessage = _ => {
	const [message, setMessage] = useState('');
	const postMessage = s => {
		if (s === message) return;
		setMessage(s);
		setTimeout(() => {setMessage('')}, 10000);
	};
	return {postMessage, message};
};

const mapObj = f => pipe([pairs, map(f), fromPairs]);

const reducer = k => mapObj( 
	p => fst(p) === k ? Pair (fst (p)) ((snd (p) ?? 0) + 1) : p
);

const Menu = props => {
	const {clicks, addCps, subClicks, onVictory} = props;
	const [hires, setHires] = useState(fromPairs(map (f => Pair (f.cost.toString()) (0)) (productiveForces)));
	console.log('hires', hires);
	const {postMessage, message} = useMessage();
	const handleHire = ({cps, cost}) => {
		if (cost === 10000) onVictory();
		setHires(reducer (cost.toString()));
		subClicks(cost);
		addCps(cps);
	};
	const isPortrait = (window.innerHeight > window.innerWidth);
	return (
		<div>
			<div>
				<h2 style={{width: 'max-content'}}>Genders: {clicks}</h2>
			</div>
			<div style={{height: `${isPortrait ? 2 : 5}rem`, fontSize: `${isPortrait ? 0.75 : 1}rem`}}>
				{message}
			</div>
			<h3>summon comrades:</h3>
			<ul>
				{productiveForces.map(p => 
					<Producer {...p} active={available(clicks)(p)} key={p.cost} nHired={hires[p.cost.toString()]} postMessage={postMessage} onHire={handleHire}/>
				)}
			</ul>
		</div>
	);
};

const Victory = props => {
	return (
		<div style={{height: '100%', ...center}}>
			10000 genders have bloomed under your careful gaze.
			<br/>
			you have become Helen Hester.
			<br/>
			welcome to xenofeminism.
		</div>
	);
};

const acc = setter => state => n => setter(add(n)(state));
const rem = setter => state => n => setter(sub(n)(state));
export const Home = props => {
	const [genders, setGenders] = useState(0);
	const addClicks = n => setGenders(c => c + n);
	const succClicks = _ => setGenders(c => c + 1);
	const remClicks = n => rem (setGenders) (genders) (n);

	const cpses = useState(0);
	const [cps, setCps] = cpses;
	const addCps = n => acc (setCps) (cps) (n);

	const [victory, setVictory] = useState(false);
	const handleVictory = _ => setVictory(true);

	useEffect(() => {
		const interval = setInterval(_ => addClicks(cps), 1000);
		return _ => clearInterval(interval);
	});

	if (victory) return <Victory/>;

	const marginTop = window.innerHeight / 6;
	const marginLeft = window.innerWidth / 7;
	const isPortrait = (window.innerHeight > window.innerWidth);
	return isPortrait ? (
		<div>
			<div>
				<h1 style={{margin: 0, fontSize: '1.5em'}}>xenofeminism simulator</h1>
				<Menu clicks={genders} addCps={addCps} subClicks={remClicks} onVictory={handleVictory}/>
				<Cookie onClick={succClicks} style={{width: `${remiSizeAlgo(genders)}%`}} />
				{genders === 0 ? '^^ Let a hundred sexes bloom! ^^' : ''}
			</div>
		</div>
	) : (
		<div style={{height: '100%', width: '100%', marginTop, marginLeft}}>
			<div style={{height: '50%', width: '75%', ...center}}>
				<h1>xenofeminism simulator</h1>
				<div style={{display: 'flex'}}>
					<div style={{width: '50%'}}>
						<Menu clicks={genders} addCps={addCps} subClicks={remClicks} onVictory={handleVictory}/>
					</div>
					<div style={{width: '50%'}}>
						<div style={{display: 'flex'}}>
							<Cookie onClick={succClicks} style={{width: `${remiSizeAlgo(genders)}%`}} />
							{genders === 0 ? '<= Let a hundred sexes bloom! <=' : ''}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
