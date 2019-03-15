export default (theme) => {
  const { primary, accent } = theme.palette;
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    title: {
      textDecoration: 'none',
      color: '#555',
    },
    tab: {
      backgroundColor: primary[500],
      textAlign: 'center',
      display: 'inline-block',
      padding: '0 6px',
      color: '#fff',
      borderRadius: 3,
      marginRight: 10,
      fontSize: '12px',
      flexShrink: 0,
    },
    good: {
      backgroundColor: accent[600],
    },
    top: {
      backgroundColor: accent[200],
    },
  };
};

export const topicSecondaryStyle = (theme) => {
  const { accent } = theme.palette;
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 3,
      flexWrap: 'wrap',
    },
    count: {
      textAlign: 'center',
      marginRight: 20,
    },
    userName: {
      marginRight: 20,
      color: '#9e9e9e',
    },
    accentColor: {
      color: accent[500],
    },
  };
};
