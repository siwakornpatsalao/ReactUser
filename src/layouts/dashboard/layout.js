import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { withAuthGuard } from 'src/hocs/with-auth-guard';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { padding } from '@mui/system';

const SIDE_NAV_WIDTH = 430;

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingRight: SIDE_NAV_WIDTH
  }
}));

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
});

export const Layout = withAuthGuard((props) => {
  const { children, sideClose, setSideClose, amount } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  const [openSide, setOpenSide] = useState(false);
  const [detailCheck, setDetailCheck] = useState(false);

  const handleDataSend = (data) =>{
    console.log('Received data:', data);
    console.log(sideClose, 'sideClose');
    console.log(openSide,'openSide');
    console.log(detailCheck, 'detailCheck')
    if(data){
      setSideClose(!sideClose);
      setOpenSide(!openSide);
      setOpenNav(!openNav);
      setDetailCheck(!detailCheck);
    }
  }


  const handlePathnameChange = useCallback(
    () => {
      if (openNav) {
        setOpenNav(false);
      }
    },
    [openNav]
  );

  useEffect(
    () => {
      handlePathnameChange();
      if(sideClose){
        console.log(sideClose,'tetstsetstset');
        setOpenNav(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  )

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} amount={amount} onSendData={handleDataSend}/>
      {sideClose && !openSide ? (
        <>
        {children}
        </>) : !sideClose && openSide && detailCheck ? (
          <>
          <SideNav
          onClose={() => setOpenNav(false)}
          open={openNav}
          detailCheck={detailCheck}/> 
{/*         <LayoutRoot>
          <LayoutContainer>
            {children}
          </LayoutContainer>
        </LayoutRoot> */}
        {children}
          </>
        )
      : (
        <>
      <SideNav
        onClose={() => setOpenNav(false)}
        open={openNav}/> 
      <LayoutRoot>
        <LayoutContainer>
          {children}
        </LayoutContainer>
      </LayoutRoot>
      </>
    )}
    </>
  );
});
