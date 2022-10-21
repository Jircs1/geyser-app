import { useContext, useEffect, useState } from 'react';
import { ShippingDestination, shippingTypes } from '../constants';
import { AuthContext } from '../context';

import { IProjectReward, IRewardCount } from '../interfaces';

export interface IFundForm {
  donationAmount: number;
  rewardsCost: number;
  comment: string;
  anonymous: boolean;
  shippingDestination: ShippingDestination;
  shippingCost: number;
  email: string;
  media: string;
  funderUsername: string;
  funderAvatarURL: string;
  rewards: { [key: string]: number };
}

export interface IuseFundStateProps {
  rewards?: IProjectReward[];
}

export type TupdateReward = (_: IRewardCount) => void;

export interface IFundFormState {
  state: IFundForm;
  // eslint-disable-next-line no-unused-vars
  setTarget: (event: any) => void;
  // eslint-disable-next-line no-unused-vars
  setState: (name: string, value: any) => void;
  updateReward: TupdateReward;
  resetForm: () => void;
}

export const useFundState = ({ rewards }: IuseFundStateProps) => {
  const { user } = useContext(AuthContext);

  const initialState = {
    donationAmount: 0,
    rewardsCost: 0,
    comment: '',
    shippingDestination: shippingTypes.national,
    shippingCost: 0,
    anonymous: !(user && user.id), // The default user has id 0
    funderAvatarURL: user.imageUrl || '',
    funderUsername: user.username,
    email: '',
    media: '',
    rewards: {},
  };

  const [state, _setState] = useState<IFundForm>(initialState);
  const setTarget = (event: any) => {
    const { name, value } = event.target;
    const newState = { ...state, [name]: value };
    _setState(newState);
  };

  useEffect(() => {
    if (!user || !user.id) {
      setState('anonymous', true);
    } else {
      setState('anonymous', false);
    }
  }, [user]);

  const setState = (name: string, value: any) => {
    const newState = { ...state, [name]: value };
    _setState(newState);
  };

  const updateReward = ({ id, count }: IRewardCount) => {
    const newRewards = { ...state.rewards };

    if (count !== 0) {
      newRewards[id] = count;
    } else if (count === 0) {
      delete newRewards[id];
    }

    let rewardsCost = 0;
    if (rewards) {
      Object.keys(newRewards).map((key: string) => {
        const id = parseInt(key, 10);
        const reward = rewards.find(
          (reward: IProjectReward) =>
            reward.id === id || `${reward.id}` === key,
        );

        if (reward && reward.id) {
          /*
           * IMPORTANT: the reward.currency is undefined at the moment of writing this. This means the cost defaults to
           * being divided by 100, which assumes the cost is expressed in fiat (specifically USD). This was done as a quick fix
           * and must be refactored.
           */
          const cost =
            reward.currency === 'btc' ? reward.cost : reward.cost / 100;

          rewardsCost += cost * newRewards[key];
        }
      });
    }

    const newState = {
      ...state,
      rewards: newRewards,
      rewardsCost,
      totalAmount: rewardsCost + state.donationAmount,
    };
    _setState(newState);
  };

  const resetForm = () => {
    _setState(initialState);
  };

  return { state, setTarget, setState, updateReward, resetForm };
};
