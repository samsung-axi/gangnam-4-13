import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, XCircle, RefreshCw } from 'lucide-react';
import styles from '../../css/mypage/MySubscriptions.module.css';
import { fetchSubscriptions, cancelSubscriptionThunk, createSubscriptionThunk } from '../../module/SubscriptionModule';

const MySubscriptions = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subscriptions, loading } = useSelector(state => state.subscription);
    const auth = JSON.parse(localStorage.getItem('auth'));

    useEffect(() => {
        const loadSubscriptions = async () => {
            if (auth?.id) {
                try {
                    console.log('Fetching subscriptions for member:', auth.id);
                    await dispatch(fetchSubscriptions(auth.id));
                } catch (error) {
                    console.error('Failed to load subscriptions:', error);
                }
            }
        };

        loadSubscriptions();
    }, [auth?.id, dispatch]);

    // 디버깅: 구독 데이터 확인
    useEffect(() => {
        if (subscriptions && subscriptions.length > 0) {
            console.log('📦 구독 데이터:', subscriptions);
            subscriptions.forEach(sub => {
                console.log(`- ${sub.productName}:`, {
                    active: sub.active,
                    canceledAt: sub.canceledAt,
                    subscribedAt: sub.subscribedAt
                });
            });
        }
    }, [subscriptions]);

    const handleCancel = async (subscription) => {
        if (window.confirm(`'${subscription.productName}' 구독을 취소하시겠습니까?`)) {
            try {
                await dispatch(cancelSubscriptionThunk(subscription.subscriptionId, auth.id));
                await dispatch(fetchSubscriptions(auth.id));
                alert('구독이 취소되었습니다.');
            } catch (error) {
                // 에러 메시지 정확히 추출
                let errorMessage = '구독 취소에 실패했습니다.';
                
                if (error.message) {
                    errorMessage = error.message;
                }
                
                alert(errorMessage);
                console.error('구독 취소 실패:', errorMessage);
            }
        }
    };

    const handleResubscribe = async (subscription) => {
        if (window.confirm(`'${subscription.productName}' 구독을 다시 시작하시겠습니까?`)) {
            try {
                await dispatch(createSubscriptionThunk(auth.id, subscription.productId));
                await dispatch(fetchSubscriptions(auth.id));
                alert('구독이 재개되었습니다!');
            } catch (error) {
                // 에러 메시지 정확히 추출
                let errorMessage = '재구독에 실패했습니다.';
                
                if (error.message) {
                    errorMessage = error.message;
                }
                
                alert(errorMessage);
                console.error('재구독 실패:', errorMessage);
            }
        }
    };

    // 마지막 배송일 계산 (취소일 기준으로 20일 배송)
    const calculateLastDeliveryDate = (canceledAt) => {
        const cancelDate = new Date(canceledAt);
        const cancelDay = cancelDate.getDate();
        
        // 20일 이전에 취소했으면 해당 달 20일
        if (cancelDay < 20) {
            return new Date(cancelDate.getFullYear(), cancelDate.getMonth(), 20);
        } 
        // 20일 이후에 취소했으면 다음 달 20일
        else {
            return new Date(cancelDate.getFullYear(), cancelDate.getMonth() + 1, 20);
        }
    };

    // 다음 결제일 계산 (구독일 기준으로 한 달 뒤)
    const calculateNextPaymentDate = (subscribedAt) => {
        const subscribeDate = new Date(subscribedAt);
        return new Date(subscribeDate.getFullYear(), subscribeDate.getMonth() + 1, subscribeDate.getDate());
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <div className={styles.loading}>로딩 중...</div>
            ) : subscriptions?.length > 0 ? (
                <div className={styles.subscriptionList}>
                    {subscriptions.map(subscription => (
                        <div key={subscription.subscriptionId} className={styles.subscriptionItem}>
                            <div className={styles.iconWrapper}>
                                <Package className={styles.packageIcon} size={24} />
                            </div>
                            <div className={styles.subscriptionInfo}>
                                <h4 
                                    className={styles.productName}
                                    onClick={() => navigate(`/perfume/${subscription.productId}`)}
                                >
                                    {subscription.productName}
                                </h4>
                                <div className={styles.subscriptionDetails}>
                                    <span className={styles.date}>
                                        구독일: {new Date(subscription.subscribedAt).toLocaleDateString()}
                                    </span>
                                    <span className={subscription.active ? styles.statusActive : styles.statusInactive}>
                                        {subscription.active ? '구독중' : '취소됨'}
                                    </span>
                                </div>
                                {subscription.active ? (
                                    // 구독중일 때: 다음 결제일 표시
                                    <span className={styles.nextPaymentDate}>
                                        다음 결제일: {calculateNextPaymentDate(subscription.subscribedAt).toLocaleDateString()}
                                    </span>
                                ) : (
                                    // 취소했을 때: 취소일과 마지막 배송일 표시
                                    <>
                                        <span className={styles.cancelDate}>
                                            취소일: {new Date(subscription.canceledAt).toLocaleDateString()}
                                        </span>
                                        <span className={styles.lastDeliveryDate}>
                                            마지막 배송일: {calculateLastDeliveryDate(subscription.canceledAt).toLocaleDateString()}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className={styles.buttonGroup}>
                                {subscription.active ? (
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => handleCancel(subscription)}
                                    >
                                        <XCircle size={16} />
                                        구독 취소
                                    </button>
                                ) : (
                                    <button
                                        className={styles.resubscribeButton}
                                        onClick={() => handleResubscribe(subscription)}
                                    >
                                        <RefreshCw size={16} />
                                        재구독
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.noSubscriptions}>구독 중인 상품이 없습니다.</p>
            )}
        </div>
    );
};

export default MySubscriptions;

