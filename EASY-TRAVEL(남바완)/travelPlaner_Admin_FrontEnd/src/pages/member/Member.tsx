import React from 'react'
import { useRecoilValue } from 'recoil';
import { memberChartDataState } from '../../recoil/memberAtoms';
import { useMemberChartData } from '../../hooks/useMemberChartData';
import styles from './Member.module.scss'
import { Card } from '../../components/chartcard/Card'
import { MemberChart } from '../../components/memberchart/MemberChart'; // Assuming you've created this component

function Member() {
  useMemberChartData(); // This hook will fetch the member data when the component mounts
  const memberChartData = useRecoilValue(memberChartDataState);

  return (
    <div className={styles.member_container}>
      <div className={styles.member_content_container}>
        <div className={styles.member_title_container}>
          <h2 className={styles.member_title}>New Member Singup Count</h2>
        </div>
        <div className={styles.member_main_content_container}>
        <Card type="member" title="Member Signups" />
        </div>
      </div>
    </div>
  )
}

export default Member
